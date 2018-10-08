export interface ITrackingCloudResponseDebug {
    response: any;
}

export interface ITrackingCloudResponse {
    debug: ITrackingCloudResponseDebug;
}

export class TrackingEmptySuccessResponse implements ITrackingCloudResponse {
    constructor(
        public debug: ITrackingCloudResponseDebug
    ) { }
}

export class TrackingCloudError {
    public errorId: string;
    public code: string;
    public message: number;
    public description: number;
    public errors: any;

    constructor(data: {
        errorId: string,
        code: string,
        message: number,
        description: number
        errors: any
    }) {
        Object.assign(this, data);
    }
}
