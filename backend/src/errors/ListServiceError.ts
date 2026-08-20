export class ListServiceError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'ListServiceError';
        this.statusCode = statusCode;
    }
}
