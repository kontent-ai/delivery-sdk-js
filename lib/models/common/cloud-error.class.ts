export class CloudError {
    public message: string;
    public requestId: string;
    public errorCode: number;
    public specificCode: number;

    constructor(data: {
        message: string,
        requestId: string,
        errorCode: number,
        specificCode: number
    }) {
        Object.assign(this, data);
    }
}
