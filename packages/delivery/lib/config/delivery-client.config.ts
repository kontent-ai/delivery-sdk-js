import { IHeader, IHttpRequestConfig, IHttpRequestResponse, IHttpService } from 'kentico-cloud-core';

import { ElementResolver } from '../elements';
import { ElementCollisionResolver, IProxyUrlData, IQueryConfig, TypeResolver } from '../models';

export interface IDeliveryClientPreviewConfig {
    /**
     * Indicates if preview mode should be enabled globally
     */
    isEnabledGlobally: boolean;
    /**
    * Preview API key
    */
    previewApiKey: string;
}

export interface IDeliveryClientSecureConfig {
    /**
    * Indicates if secure mode should be enabled globally
    */
    isEnabledGlobally: boolean;
    /**
    * Secure API key
    * Important: Use secured API only when running on Node.JS server, otherwise
    * your key will be visible in browsers when making requests.
    */
    secureApiKey: string;
}

export interface IDeliveryClientProxyConfig {
    /**
     * Base url used for preview reqeusts. Defaults to 'preview-deliver.kenticocloud.com'
     */
    basePreviewUrl?: string;

    /**
     * Can be used to generate custom request urls.
     * Useful when you have a proxy server and need to transform url to a specific format
     * and setting 'baseUrl' is not sufficient.
     */
    advancedProxyUrlResolver?: (data: IProxyUrlData) => string;

    /**
    * Base url used for all requests. Defaults to 'deliver.kenticocloud.com'
    */
    baseUrl?: string;
}

export interface IDeliveryClientConfig {

    /**
     * ProjectId of your Kentico Cloud project
     */
    projectId: string;

    /**
     * Type resolver is used to create an instance of class based on content item's type. For example,
     * if content item has 'article' content type (system.type), you can map it to 'Article' class with
     * properties, methods and global content item configuration. 
     * If not set, content item will use default 'ContentItem' class
     */
    typeResolvers?: TypeResolver[];

    /**
     * Resolver used for using custom models for custom elements.
     */
    elementResolver?: ElementResolver;

    /**
    * When enabled, additional information are logged in console for certain issues.
    * Disable in production environments.
    */
    isDeveloperMode?: boolean;

    /**
     * Preview mode configuration
     */
    previewMode?: IDeliveryClientPreviewConfig;

    /**
     * Secure mode configuration
     */
    secureMode?: IDeliveryClientSecureConfig;

    /**
     * Proxy configuration
     */
    proxy?: IDeliveryClientProxyConfig;

    /**
     * Default language of content items
     */
    defaultLanguage?: string;

    /**
     * Number of retry attempts for failed requests. Defaults to 3. To disable retries set use 0.
     */
    retryAttempts?: number;

    /**
     * Can be used to inject custom Http service to perform requests
     */
    httpService?: IHttpService;

    /**
     * Global settings for linked item resolver
     */
    linkedItemResolver?: {
        /**
         * Element used for wrapping resolved linked item
         */
        linkedItemWrapperTag?: string,
        /**
         * CSS classes applied to wrapper
         */
        linkedItemWrapperClasses?: string[]
    };

    /**
     * Interceptors of HTTP requests. This may be used to alter request before its sent or response after its received.
     */
    httpInterceptors?: {
        requestInterceptor?: (config: IHttpRequestConfig) => IHttpRequestConfig;
        responseInterceptor?: (config: IHttpRequestResponse) => IHttpRequestResponse;
    };

    /**
     * Extra headers added to each http request
     */
    globalHeaders?: (queryConfig: IQueryConfig) => IHeader[];

    /**
     * Resolver used when content item properties would overlap. Collision resolver can be used to change property name to avoid conflicts.
     */
    collisionResolver?: ElementCollisionResolver;

    /**
     * Array of status codes that should be retried when request fails. Defaults [500].
     */
    retryStatusCodes?: number[];

}

