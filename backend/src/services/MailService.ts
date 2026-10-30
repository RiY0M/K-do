import { createTransport, type Transporter } from 'nodemailer';

export interface Mail {
    to: string;
    subject: string;
    text: string;
    html: string;
}

/**
 * Sends e-mails through the SMTP server configured by the environment:
 * SMTP_HOST, SMTP_PORT (587 by default), SMTP_SECURE ("true" for port 465),
 * SMTP_USER / SMTP_PASSWORD (optional) and MAIL_FROM.
 *
 * In development, compose.yml points it at Mailpit (web interface on port
 * 8025), which catches every e-mail. In production, MAIL_FROM is required
 * (checked in config.ts). Without SMTP_HOST, e-mails are only logged.
 */
export class MailService {
    private transporter: Transporter | null;
    private from: string;

    constructor(private logger: { info: (obj: object, msg?: string) => void } = console) {
        const host = process.env.SMTP_HOST;

        this.from = process.env.MAIL_FROM ?? 'K-do <no-reply@k-do.local>';
        this.transporter = host
            ? createTransport({
                  host,
                  port: Number(process.env.SMTP_PORT ?? 587),
                  secure: process.env.SMTP_SECURE === 'true',
                  auth: process.env.SMTP_USER
                      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD ?? '' }
                      : undefined,
              })
            : null;
    }

    async send(mail: Mail): Promise<void> {
        if (!this.transporter) {
            this.logger.info({ to: mail.to, subject: mail.subject, text: mail.text }, 'SMTP_HOST not set, e-mail not sent');
            return;
        }

        await this.transporter.sendMail({ from: this.from, ...mail });
    }
}
