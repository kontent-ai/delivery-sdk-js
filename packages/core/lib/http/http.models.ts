
export interface IBaseResponse<TRawData> {
    data: TRawData;
    response: any;
}

export interface IBaseResponseError<TError extends any> {
    mappedError: TError;
    originalError: any;
}

export interface IHttpQueryCall<TError extends any> {
    url: string;
    mapError: (originalError: any) => TError;
}

export interface IHttpPostQueryCall<TError extends any> extends IHttpQueryCall<TError> {
    body: any;
}

export interface IHttpGetQueryCall<TError extends any> extends IHttpQueryCall<TError> {
}

export interface IHttpQueryOptions {
    useRetryForResponseCodes?: number[];
    maxRetryAttempts?: number;
    headers?: IHeader[];
    logErrorToConsole?: boolean;
}

export interface IHeader {
    header: string;
    value: string;
}

export class IHttpRequestResult<TResponse> {
    constructor(
        public response?: TResponse,
        public error?: any
    ) { }
}

