import { Prisma, PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AuthServiceError } from '../errors/AuthServiceError';
import { DEFAULT_LIST_LABEL } from './ListService';

export class AuthService {
    constructor(private prisma: PrismaClient) {}

    async registerUser(name: string, password: string, email?: string): Promise<User> {
        // Exact matches only: `contains` used to reject "ann" as soon as an
        // "anna" existed, and the e-mail check was comparing against the name.
        const existingUsername = await this.prisma.user.findUnique({
            where: { username: name },
        });
        if (existingUsername) {
            throw new AuthServiceError('Username already taken', 409);
        }

        if (email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email },
            });
            if (existingEmail) {
                throw new AuthServiceError('Email already used', 409);
            }
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        try {
            return await this.prisma.user.create({
                data: {
                    username: name,
                    email: email ?? null,
                    passwordHash,
                    lastSave: new Date(),
                    // Every user gets their default list right away (see
                    // ListService.ensureDefaultList).
                    lists: { create: { label: DEFAULT_LIST_LABEL, position: 1 } },
                },
            });
        } catch (err) {
            // Two registrations racing for the same username/e-mail
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new AuthServiceError('Username or email already used', 409);
            }
            throw err;
        }
    }

    async loginUser(name: string, password: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { username: name },
        });

        if (!user || user.deletedAt) {
            throw new AuthServiceError('Invalid credentials', 401);
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new AuthServiceError('Invalid credentials', 401);
        }

        return user;
    }
}
