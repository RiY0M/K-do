import { createHash, randomBytes } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { PasswordResetServiceError } from '../errors/PasswordResetServiceError';
import { MailService } from './MailService';

// How long a reset link stays valid, and the minimum delay between two
// e-mails for the same account (avoids flooding someone's inbox).
const TOKEN_TTL_MS = 60 * 60 * 1000;
const RESEND_DELAY_MS = 60 * 1000;

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

// "yoni.rigaut@gmail.com" -> "y*********t@gmail.com"
export function maskEmail(email: string): string {
    const [local = '', domain = ''] = email.split('@');
    const masked = local.length <= 2 ? `${local[0] ?? ''}*` : `${local[0]}${'*'.repeat(local.length - 2)}${local.at(-1)}`;
    return `${masked}@${domain}`;
}

/**
 * "Forgot password" flow. Backs POST /auth/forgotPassword and
 * POST /auth/resetPassword.
 *
 * The e-mail contains a link to the frontend's /reset-password/:token page.
 * Only a SHA-256 hash of the token is stored; a link works once, for an hour.
 * Accounts registered without an e-mail address can't use it.
 */
export class PasswordResetService {
    constructor(
        private prisma: PrismaClient,
        private mailService: MailService
    ) {}

    /**
     * @param identifier username or e-mail address
     * @returns the masked e-mail address the link was sent to
     */
    async requestReset(identifier: string): Promise<string> {
        const user = await this.prisma.user.findFirst({
            where: {
                deletedAt: null,
                OR: [{ username: identifier }, { email: identifier }],
            },
        });

        if (!user) {
            throw new PasswordResetServiceError('User not found', 404);
        }

        if (!user.email) {
            throw new PasswordResetServiceError('No email address on this account', 400);
        }

        const lastToken = await this.prisma.passwordResetToken.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        if (lastToken && Date.now() - lastToken.createdAt.getTime() < RESEND_DELAY_MS) {
            throw new PasswordResetServiceError('Please wait a minute before asking for another email', 429);
        }

        const token = randomBytes(32).toString('base64url');

        // Only the latest link is valid
        await this.prisma.$transaction([
            this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
            this.prisma.passwordResetToken.create({
                data: {
                    userId: user.id,
                    tokenHash: hashToken(token),
                    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
                },
            }),
        ]);

        const frontendUrl = (process.env.FRONTEND_URL ?? 'http://localhost:5173').replace(/\/$/, '');
        const link = `${frontendUrl}/reset-password/${token}`;

        await this.mailService.send({
            to: user.email,
            subject: 'K-do : réinitialisation de votre mot de passe',
            text: [
                `Bonjour ${user.username},`,
                '',
                'Pour choisir un nouveau mot de passe, ouvrez ce lien (valable une heure) :',
                link,
                '',
                "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.",
            ].join('\n'),
            html: `<p>Bonjour ${escapeHtml(user.username)},</p>
<p>Pour choisir un nouveau mot de passe, cliquez sur ce lien (valable une heure)&nbsp;:</p>
<p><a href="${link}">Réinitialiser mon mot de passe</a></p>
<p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.</p>`,
        });

        return maskEmail(user.email);
    }

    async resetPassword(token: string, password: string): Promise<void> {
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { tokenHash: hashToken(token) },
            include: { user: true },
        });

        if (!resetToken || resetToken.usedAt || resetToken.user.deletedAt) {
            throw new PasswordResetServiceError('Invalid or already used reset link', 400);
        }

        if (resetToken.expiresAt.getTime() <= Date.now()) {
            throw new PasswordResetServiceError('This reset link has expired', 410);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: resetToken.userId },
                data: { passwordHash },
            }),
            this.prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() },
            }),
        ]);
    }
}

function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}
