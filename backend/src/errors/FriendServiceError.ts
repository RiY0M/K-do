export class FriendServiceError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'FriendServiceError';
        this.statusCode = statusCode;
    }
}
