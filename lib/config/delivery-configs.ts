import { IHeader, IHttpService, IRetryStrategyOptions } from '@kontent-ai/core-sdk';

import { ElementResolver } from '../elements';
import { LinkedItemsReferenceHandler, IProxyUrlData, IQueryConfig, PropertyNameResolver } from '../models';

export interface IDeliveryClientProxyConfig {
    /**
     * Base url used for preview reqeusts. Defaults to 'preview-deliver.kontent.ai'
     */
    basePreviewUrl?: string;

    /**
     * Can be used to generate custom request urls.
     * Useful when you have a proxy server and need to transform url to a specific format
     * and setting 'baseUrl' is not sufficient.
     */
    advancedProxyUrlResolver?: (data: IProxyUrlData) => string;

    /**
     * Base url used for all requests. Defaults to 'deliver.kontent.ai'
     */
    baseUrl?: string;
}

export interface IDeliveryClientConfig {
    /**
     * ProjectId of your Kontent.ai project
     */
    projectId: string;

    /**
     * Resolver used to rename content item elements. Can be used to e.g. transform underscored element codenames to camelCase format
     */
    propertyNameResolver?: PropertyNameResolver;

    /**
     * Preview API key
     */
    previewApiKey?: string;

    /**
     * Secure API key
     * Important: Use secured API only when running on Node.JS server, otherwise
     * your key would be exposed in browsers
     */
    secureApiKey?: string;

    /**
     * Resolver used for using custom models for custom elements.
     */
    elementResolver?: ElementResolver;

    /**
     * Proxy configuration
     */
    proxy?: IDeliveryClientProxyConfig;

    /**
     * Default language of content items
     */
    defaultLanguage?: string;

    /**
     * Retry policy configuration
     */
    retryStrategy?: IRetryStrategyOptions;

    /**
     * Can be used to inject custom Http service to perform requests
     */
    httpService?: IHttpService<any>;

    /**
     * Extra headers added to each http request
     */
    globalHeaders?: (queryConfig: IQueryConfig) => IHeader[];

    /**
     * Default query configuration. Can be overriden by individual queries.
     */
    defaultQueryConfig?: IQueryConfig;

    /**
     * Indicates how linked item references are handled (can be used to disable refence mapping when you encounter an issue
     * with circular refences)
     */
    linkedItemsReferenceHandler?: LinkedItemsReferenceHandler;

    /**
     * Sets custom domain for assets
     */
    assetsDomain?: string;

    /**
     * Codename of rendition preset to be applied by default to the base asset URL path.
     */
    defaultRenditionPreset?: string;
}
