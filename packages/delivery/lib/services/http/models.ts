import { DeliveryCloudError } from '../../models';

export interface IBaseResponse {
    data: any;
    response: any;
}

export interface IBaseResponseError {
    message: string;
    originalError: any;
    cloudError?: DeliveryCloudError;
}

export interface IBaseResponseCloudError {
    message: string;
    requestId: number;
    errorCode: number;
    specificCode: number;
}


