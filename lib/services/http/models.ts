export interface IBaseResponse {
    data: JSON;
    response: any;
}

export interface IBaseCloudError {
    message: string;
    request_id: number;
    error_code: number;
    specific_code: number;
}
