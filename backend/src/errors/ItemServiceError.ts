export class ItemServiceError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'ItemServiceError';
        this.statusCode = statusCode;
    }
}
