export class InvitationServiceError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'InvitationServiceError';
        this.statusCode = statusCode;
    }
}
