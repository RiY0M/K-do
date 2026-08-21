import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AuthServiceError } from '../errors/AuthServiceError';

export class AuthService {
    constructor(private prisma: PrismaClient) {}

    async registerUser(name: string, password: string, email?: string): Promise<User> {
        const existingUsername = await this.prisma.user.findMany({
            where: {
                username: {
                    contains: name
                }
            },
        });
        if (existingUsername.length > 0) {
            throw new AuthServiceError('Username already taken', 409);
        }

        if (email) {
            const existingEmail = await this.prisma.user.findMany({
                where: {
                    email: {
                        contains: name
                    }
                },
            });
            if (existingEmail.length > 0) {
                throw new AuthServiceError('Email already used', 409);
            }
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        return this.prisma.user.create({
            data: {
                username: name,
                email: email ?? null,
                passwordHash,
                lastSave: new Date(),
            },
        });
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
