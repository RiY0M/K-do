export class UserServiceError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'UserServiceError';
        this.statusCode = statusCode;
    }
}
