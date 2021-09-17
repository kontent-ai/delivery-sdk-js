import { IHeader, IHttpCancelRequestToken, IQueryParameter } from '@kentico/kontent-core';
import { IKontentNetworkResponse } from './base-responses';
import { Pagination } from './pagination.class';

export interface IProxyUrlData {
    action: string;
    domain: string;
    queryParameters: IQueryParameter[];
    queryString: string;
    queryConfig: IQueryConfig;
    projectId: string;
}

export interface ISDKInfo {
    /**
     * Name of SDK
     */
    name: string;
    /**
     * Version SDK
     */
    version: string;
    /**
     * Host of SDK
     */
    host: string;
}

export interface IKontentResponse {
}

export interface IKontentListWithHeaderResponse extends IKontentResponse {
    items: any[];
}

export interface IKontentListResponse extends IKontentResponse {
    pagination?: Pagination;
    continuationToken?: string;
    items: any[];
}

export interface IKontentListAllResponse extends IKontentResponse {
    responses: any[];
    items: any[];
}

export interface IListQueryConfig<TResponse extends IKontentListResponse> {
    /**
     * Delay between each HTTP requests
     */
    delayBetweenRequests?: number;

    /**
     * Executed when a list response is loaded
     */
    responseFetched?: (response: IKontentNetworkResponse<TResponse>, nextPageUrl?: string, continuationToken?: string) => void;
}

export interface IQueryConfig {
    /**
     * Indicates if query should use preview mode. Overrides global settings of Delivery Client
     */
    usePreviewMode?: boolean;

    /**
     * Indicates if query should use secured delivery API mode. Overrides global settings of Delivery Client
     */
    useSecuredMode?: boolean;

    /**
     * If the requested content has changed since the last request, the header determines whether
     * to wait while fetching content. This can be useful when retrieving changed content
     * in reaction to a webhook call. By default, when the header is not set, the API
     * serves old content (if cached by the CDN) while it's fetching the new content
     * to minimize wait time.
     */
    waitForLoadingNewContent?: boolean;

    customHeaders?: IHeader[];

    cancelTokenRequest?: IHttpCancelRequestToken<any>;
}

export interface IDeliveryErrorRaw {
    message: string;
    request_id: string | null;
    error_code: number;
    specific_code: number;
}

export class DeliveryError {
    public message: string;
    public requestId: string | null;
    public errorCode: number;
    public specificCode: number;

    constructor(data: { message: string; requestId: string | null; errorCode: number; specificCode: number }) {
        this.message = data.message;
        this.requestId = data.requestId;
        this.errorCode = data.errorCode;
        this.specificCode = data.specificCode;
    }
}
