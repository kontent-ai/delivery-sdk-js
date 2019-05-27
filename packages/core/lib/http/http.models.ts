
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

export interface IHttpPutQueryCall<TError extends any> extends IHttpQueryCall<TError> {
    body: any;
}

export interface IHttpDeleteQueryCall<TError extends any> extends IHttpQueryCall<TError> {
}

export interface IHttpGetQueryCall<TError extends any> extends IHttpQueryCall<TError> {
}

export interface IHttpQueryOptions {
    useRetryForResponseCodes?: number[];
    maxRetryAttempts?: number;
    headers?: IHeader[];
    logErrorToConsole?: boolean;
    responseType?: string;
}

export interface IHeader {
    header: string;
    value: string;
}

export interface IHttpRequestCredentials {
    username: string;
    password: string;
}

export interface IHttpRequestProfxyConfig {
    host: string;
    port: number;
    auth?: {
        username: string;
        password: string;
    };
}

export interface IHttpRequestConfig {
    url?: string;
    method?: string;
    baseURL?: string;
    headers?: any;
    params?: any;
    paramsSerializer?: (params: any) => string;
    data?: any;
    timeout?: number;
    withCredentials?: boolean;
    auth?: IHttpRequestCredentials;
    responseType?: string;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    maxContentLength?: number;
    validateStatus?: (status: number) => boolean;
    maxRedirects?: number;
    httpAgent?: any;
    httpsAgent?: any;
    proxy?: IHttpRequestProfxyConfig | false;
}

export interface IHttpRequestResponse {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: IHttpRequestConfig;
    request?: any;
}

export class IHttpRequestResult<TResponse> {
    constructor(
        public response?: TResponse,
        public error?: any
    ) { }
}

