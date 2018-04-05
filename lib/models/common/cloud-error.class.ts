export class CloudError {
    public message: string;
    public requestId: number;
    public errorCode: number;
    public specifiCode: number;

    constructor(data: {
        message: string,
        requestId: number,
        errorCode: number,
        specifiCode: number
    }) {
        Object.assign(this, data);
    }
}
