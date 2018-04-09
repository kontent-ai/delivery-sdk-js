import { TypeResolver } from '../models';

export interface IDeliveryClientConfig {

    /**
     * ProjectId of your Kentico Cloud project
     */
    projectId: string;

    /**
     * List of resolvers that are used to create strongly typed objects from Kentico Cloud response.
     * If not set, items will use IContentItem
     */
    typeResolvers?: TypeResolver[];

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
     * Number of retry attempts when error occures. When not set, no retry attempts are made.
     */
    retryAttempts?: number;

}

