import { CloudError } from '../../models';

export interface IBaseResponse {
    data: any;
    response: any;
}

export interface IBaseResponseError {
    message: string;
    originalError: any;
    cloudError?: CloudError;
}

export interface IBaseResponseCloudError {
    message: string;
    requestId: number;
    errorCode: number;
    specificCode: number;
}


