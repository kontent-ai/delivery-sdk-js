import { IHeader, IHttpRequestConfig, IHttpRequestResponse, IHttpService } from 'kentico-cloud-core';

import { ElementResolver } from '../elements';
import { IProxyUrlData, IQueryConfig } from '../interfaces';
import { ElementCollisionResolver, TypeResolver } from '../models';

export interface IDeliveryClientConfig {

    /**
     * ProjectId of your Kentico Cloud project
     */
    projectId: string;

    /**
     * Array of resolvers that are used to create instances of registered classes automatically.
     * If not set, items will be instances of 'ContentItem' class
     */
    typeResolvers?: TypeResolver[];

    /**
     * Use to resolve elements to custom models (e.g. custom elements)
     */
    elementResolver?: ElementResolver;

    /**
    * Indicates if advanced (developer's) issues are logged in console. Enable for development and disable in production
    */
    enableAdvancedLogging?: boolean;

    /**
    * Preview API key used to get unpublished content items
    */
    previewApiKey?: string;

    /**
    * Secured API key.
    * !! Important !!
    * Use secured API only when running on Node.JS server, otherwise you are exposing your key to all clients
    */
    securedApiKey?: string;

    /**
    * Indicates if preview mode is enabled globally
    */
    enablePreviewMode?: boolean;

    /**
   * Indicates if secured mode is enabled globally
   */
    enableSecuredMode?: boolean;

    /**
     * Default content language, can be overidden with languageParameter method
     */
    defaultLanguage?: string;

    /**
     * Base url used for all requests. Defaults to 'deliver.kenticocloud.com'
     */
    baseUrl?: string;

    /**
     * Can be used to generate custom request urls. Useful when you have a proxy server and need to transform url to a specific format
     */
    proxyUrl?: (data: IProxyUrlData) => string;

    /**
     * Base url used for preview reqeusts. Defaults to 'preview-deliver.kenticocloud.com'
     */
    basePreviewUrl?: string;

    /**
     * Number of retry attempts when error occures. When not set, default number of attempts (3) are used. To disable set to 0.
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
     * Adds ability to add extra headers to each http request
     */
    globalHeaders?: (queryConfig: IQueryConfig) => IHeader[];

    /**
     * Resolver called when there are multiple elements with the same name in content item (example collision element names include 'system' or 'elements')
     */
    collisionResolver?: ElementCollisionResolver;

    /**
     * Array of status codes that should be retried when request fails. Defaults to requests with '500' status code.
     */
    retryStatusCodes?: number[];

}

