import { IHeader, IHttpCancelRequestToken, IQueryParameter } from '@kontent-ai/core-sdk';
import { IDeliveryNetworkResponse } from './base-responses';
import { IPagination } from './pagination.class';

export type LinkedItemsReferenceHandler = 'map' | 'ignore';

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

export interface IKontentResponse {}

export interface IKontentListWithHeaderResponse extends IKontentResponse {
    items: any[];
}

export interface IKontentListResponse extends IKontentResponse {
    pagination?: IPagination;
    items: any[];
}

export interface IKontentListAllResponse extends IKontentResponse {
    responses: any[];
    items: any[];
}

export interface IListAllQueryConfig<TResponse extends IKontentListResponse, TContract> {
    /**
     * Number of pages to get. If not set, all available pages are fetched.
     */
    pages?: number;

    /**
     * Delay between each HTTP requests
     */
    delayBetweenRequests?: number;

    /**
     * Executed when a list response is loaded
     */
    responseFetched?: (
        response: IDeliveryNetworkResponse<TResponse, TContract>,
        nextPageUrl?: string,
        continuationToken?: string
    ) => void;
}

export interface IQueryConfig {
    /**
     * Indicates if query should use preview mode. Overrides default configuration
     */
    usePreviewMode?: boolean;

    /**
     * Indicates if query should use secured delivery API mode.  Overrides default configuration
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

    /**
     * Extra headers added to request
     */
    customHeaders?: IHeader[];

    /**
     * Cancel token
     */
    cancelToken?: IHttpCancelRequestToken<any>;
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
