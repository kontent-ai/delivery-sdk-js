export class BaseKontentError {
    public message!: string;
    public requestId!: string;
    public errorCode!: number;
    public specificCode!: number;
    public originalError!: any;

    constructor(data: {
        message: string,
        requestId: string,
        errorCode: number,
        specificCode: number,
        originalError: any
    }) {
        Object.assign(this, data);
    }
}
