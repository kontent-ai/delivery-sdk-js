import { IHeader, IQueryParameter } from '@kentico/kontent-core';

export interface IProxyUrlData {
    action: string;
    domain: string;
    queryParameters: IQueryParameter[];
    queryString: string;
    queryConfig: IQueryConfig;
    projectId: string;
}

export interface IKontentResponseDebug {
    response: any;
    status: number;
    headers: IHeader[];
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


export interface IKontentResponse<TDebugData> {
    debug?: TDebugData;
    hasStaleContent: boolean;
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
}


