/**
 * Checks the environment when the server starts in production, so that a
 * missing or unsafe setting stops it right away instead of failing later
 * (or silently falling back to development values such as localhost URLs).
 */
const REQUIRED_IN_PRODUCTION = ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_URL'] as const;

export function checkEnvironment(log: { warn: (msg: string) => void }): void {
    if (process.env.NODE_ENV !== 'production') return;

    const missing = REQUIRED_IN_PRODUCTION.filter((name) => !process.env[name]);
    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }

    if ((process.env.JWT_SECRET ?? '').length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters long (openssl rand -hex 32)');
    }

    if (!/^https:\/\//.test(process.env.FRONTEND_URL ?? '')) {
        log.warn('FRONTEND_URL does not start with https://: e-mail links will not be secure');
    }

    if (!process.env.SMTP_HOST) {
        log.warn('SMTP_HOST is not set: password reset e-mails will not be sent');
    } else if (!process.env.MAIL_FROM) {
        throw new Error('MAIL_FROM is required when SMTP_HOST is set (e.g. "K-do <no-reply@example.fr>")');
    }
}
