export interface IBaseResponse {
    data: JSON;
    response: any;
}

export interface IBaseResponseError {
    response: any;
    message: string;
    cloudError?: IBaseResponseCloudError;
}

export interface IBaseResponseCloudError {
    message: string;
    requestId: number;
    errorCode: number;
    specificCode: number;
}
