import { IHttpService, IHeader } from 'kentico-cloud-core';

import { TypeResolver } from '../models';
import { FieldResolver } from '../fields';

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
     * Field resolver used to map custom fields to models.
     */
    fieldResolver?: FieldResolver;

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
     * Base Url. Can be overriden if e.g. a proxy is required
     */
    baseUrl?: string;

    /**
     * Base preview Url. Can be overriden if e.g. a proxy is required
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
     * Array of headers added to each and every http request made with SDK
     */
    globalHeaders?: IHeader[];

}

