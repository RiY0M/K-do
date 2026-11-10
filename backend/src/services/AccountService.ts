import { createHash, randomBytes } from 'node:crypto';
import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AccountServiceError } from '../errors/AccountServiceError';
import { MailService, escapeHtml, frontendUrl } from './MailService';
import { maskEmail } from './PasswordResetService';

// How long the "undo" link of an e-mail / password change stays valid
const UNDO_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export interface AccountDto {
    id: string;
    name: string;
    email: string | null;
}

export interface AccountUpdate {
    name: string;
    email: string | null;
    // Empty or missing: the password doesn't change
    newPassword?: string;
    currentPassword?: string;
}

/**
 * Account page (GET/PATCH /user/me) and the "undo" link of its e-mail
 * (POST /auth/revertAccountChange).
 *
 * Changing the e-mail address or the password:
 * - requires the current password;
 * - logs out every other session (User.tokenVersion);
 * - sends an e-mail to the previous address with a link that undoes the
 *   change for 7 days, in case someone else did it (stolen account). Not
 *   possible for accounts that had no e-mail address.
 */
export class AccountService {
    constructor(
        private prisma: PrismaClient,
        private mailService: MailService
    ) {}

    async getAccount(userId: string): Promise<AccountDto> {
        const user = await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } });

        if (!user) {
            throw new AccountServiceError('User not found', 404);
        }

        return { id: user.id, name: user.username, email: user.email };
    }

    /**
     * @returns the updated account, the masked address the undo e-mail was
     * sent to (or null), and the user's token version (new if sessions were
     * logged out, so the route can renew the caller's own token)
     */
    async updateAccount(userId: string, update: AccountUpdate) {
        const user = await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } });

        if (!user) {
            throw new AccountServiceError('User not found', 404);
        }

        const nameChanged = update.name !== user.username;
        const emailChanged = update.email !== user.email;
        const passwordChanged = !!update.newPassword;
        const isSensitive = emailChanged || passwordChanged;

        if (!nameChanged && !isSensitive) {
            return { account: this.toAccount(user), undoEmailSentTo: null, tokenVersion: user.tokenVersion };
        }

        if (isSensitive) {
            const isValid = !!update.currentPassword && (await bcrypt.compare(update.currentPassword, user.passwordHash));
            if (!isValid) {
                throw new AccountServiceError('Wrong current password', 400);
            }
        }

        if (nameChanged) {
            const existing = await this.prisma.user.findUnique({ where: { username: update.name } });
            if (existing && existing.id !== userId) {
                throw new AccountServiceError('Username already taken', 409);
            }
        }

        if (emailChanged && update.email) {
            const existing = await this.prisma.user.findUnique({ where: { email: update.email } });
            if (existing && existing.id !== userId) {
                throw new AccountServiceError('Email already used', 409);
            }
        }

        const passwordHash = passwordChanged ? await bcrypt.hash(update.newPassword!, 10) : undefined;

        // The undo e-mail is sent BEFORE saving: if it can't be sent, nothing
        // changes, so an e-mail or password is never changed without the
        // owner being told. (If saving then fails, e.g. two requests racing
        // for the same name, the link in the e-mail just won't work.)
        const undoToken = isSensitive && user.email ? randomBytes(32).toString('base64url') : null;

        if (undoToken && user.email) {
            await this.sendUndoEmail(user.email, user.username, undoToken, {
                newEmail: emailChanged ? update.email : undefined,
                passwordChanged,
            });
        }

        try {
            const updated = await this.prisma.$transaction(async (tx) => {
                const saved = await tx.user.update({
                    where: { id: userId },
                    data: {
                        username: update.name,
                        email: update.email,
                        ...(passwordHash ? { passwordHash } : {}),
                        // Logs out every other session; the route renews the
                        // caller's own token
                        ...(isSensitive ? { tokenVersion: { increment: 1 } } : {}),
                    },
                });

                if (undoToken) {
                    await tx.accountChange.create({
                        data: {
                            userId,
                            tokenHash: hashToken(undoToken),
                            previousEmail: emailChanged ? user.email : null,
                            previousPasswordHash: passwordChanged ? user.passwordHash : null,
                            expiresAt: new Date(Date.now() + UNDO_TTL_MS),
                        },
                    });
                }

                return saved;
            });

            return {
                account: this.toAccount(updated),
                undoEmailSentTo: undoToken && user.email ? maskEmail(user.email) : null,
                tokenVersion: updated.tokenVersion,
            };
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new AccountServiceError('Username or email already used', 409);
            }
            throw err;
        }
    }

    /**
     * Undoes an e-mail / password change from the link of the undo e-mail.
     * Also logs out every session, cancels the undo links of later changes
     * (the person who stole the account got those at THEIR address, and
     * could otherwise undo the undo) and any pending password reset link.
     */
    async revertChange(token: string): Promise<{ restoredEmail: boolean; restoredPassword: boolean }> {
        const change = await this.prisma.accountChange.findUnique({
            where: { tokenHash: hashToken(token) },
            include: { user: true },
        });

        if (!change || change.usedAt || change.user.deletedAt) {
            throw new AccountServiceError('Invalid or already used link', 400);
        }

        if (change.expiresAt.getTime() <= Date.now()) {
            throw new AccountServiceError('This link has expired', 410);
        }

        if (change.previousEmail) {
            const existing = await this.prisma.user.findUnique({ where: { email: change.previousEmail } });
            if (existing && existing.id !== change.userId) {
                throw new AccountServiceError('Email already used', 409);
            }
        }

        const now = new Date();

        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: change.userId },
                data: {
                    ...(change.previousEmail ? { email: change.previousEmail } : {}),
                    ...(change.previousPasswordHash ? { passwordHash: change.previousPasswordHash } : {}),
                    tokenVersion: { increment: 1 },
                },
            }),
            this.prisma.accountChange.update({
                where: { id: change.id },
                data: { usedAt: now },
            }),
            this.prisma.accountChange.updateMany({
                where: { userId: change.userId, usedAt: null, createdAt: { gt: change.createdAt } },
                data: { usedAt: now },
            }),
            this.prisma.passwordResetToken.deleteMany({ where: { userId: change.userId } }),
        ]);

        return {
            restoredEmail: !!change.previousEmail,
            restoredPassword: !!change.previousPasswordHash,
        };
    }

    private async sendUndoEmail(
        to: string,
        username: string,
        token: string,
        changes: { newEmail?: string | null; passwordChanged: boolean }
    ): Promise<void> {
        const link = `${frontendUrl()}/revert-account-change/${token}`;

        const lines: string[] = [];
        if (changes.newEmail !== undefined) {
            lines.push(
                changes.newEmail
                    ? `- l'adresse e-mail a été remplacée par ${maskEmail(changes.newEmail)} ;`
                    : "- l'adresse e-mail a été supprimée du compte ;"
            );
        }
        if (changes.passwordChanged) {
            lines.push('- le mot de passe a été changé ;');
        }

        await this.mailService.send({
            to,
            subject: 'K-do : modification de votre compte',
            text: [
                `Bonjour ${username},`,
                '',
                'Votre compte K-do vient d\'être modifié :',
                ...lines,
                '',
                "Si c'est bien vous, vous n'avez rien à faire.",
                '',
                "Sinon, ouvrez ce lien pour annuler ces changements (valable 7 jours). Toutes les sessions seront déconnectées :",
                link,
            ].join('\n'),
            html: `<p>Bonjour ${escapeHtml(username)},</p>
<p>Votre compte K-do vient d'être modifié&nbsp;:</p>
<ul>${lines.map((line) => `<li>${escapeHtml(line.replace(/^- /, '').replace(/ ;$/, ''))}</li>`).join('')}</ul>
<p>Si c'est bien vous, vous n'avez rien à faire.</p>
<p>Sinon, annulez ces changements avec ce lien (valable 7 jours). Toutes les sessions seront déconnectées&nbsp;:</p>
<p><a href="${link}">Annuler les changements</a></p>`,
        });
    }

    private toAccount(user: { id: string; username: string; email: string | null }): AccountDto {
        return { id: user.id, name: user.username, email: user.email };
    }
}
