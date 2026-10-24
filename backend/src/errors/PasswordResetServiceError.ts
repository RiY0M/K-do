export class PasswordResetServiceError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'PasswordResetServiceError';
        this.statusCode = statusCode;
    }
}
