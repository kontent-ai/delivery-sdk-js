import { TypeResolver } from '../models/item/type-resolver.class';

export class DeliveryClientConfig {

    /**
    * Indicates if advanced (developer's) issues are logged in console. Enable for development and disable in production
    */
    public enableAdvancedLogging: boolean = true;

    /**
    * Preview API key used to get unpublished content items
    */
    public previewApiKey?: string;

    /**
    * Secured API key.
    * !! Important !!
    * Use secured API only when running on Node.JS server, otherwise you are exposing your key to all clients
    */
    public securedApiKey?: string;

    /**
    * Indicates if preview mode is enabled globally
    */
    public enablePreviewMode: boolean = false;

     /**
    * Indicates if secured mode is enabled globally
    */
    public enableSecuredMode: boolean = false;

    /**
     * Default content language, can be overidden with languageParameter method
     */
    public defaultLanguage?: string;

    /**
     * Base Url. Can be overriden if e.g. a proxy is required
     */
    public baseUrl?: string;

    /**
     * Base preview Url. Can be overriden if e.g. a proxy is required
     */
    public basePreviewUrl?: string;

    /**
     * Number of retry attempts when error occures. When not set, no retry attempts are made.
     */
    public retryAttempts?: number;

    /**
    * Configuration of Kentico Cloud Delivery client
    * @constructor
    * @param {FieldType} projectId - ProjectId of your Kentico Cloud project
    * @param {TypeResolver[]} typeResolvers - List of resolvers that are used to create strongly typed objects from Kentico Cloud response
    * @param {boolean} enableAdvancedLogging - Indicates if advanced (developer's) issues are logged in console. Enable for development and disable in production.
    * @param {string} previewApiKey - Preview API key used to get unpublished content items
    * @param {boolean} enablePreviewMode - Indicates if preview mode is enabled globally. This can be overriden on query level
    * @param {string} defaultLanguage - Sets default language that will be used for all queries unless overriden with query parameters
    * @param {string} baseUrl - Can be used to configure custom base url
    * @param {string} basePreviewUrl - Can be used to configure custom preview url
    * @param {string} securedApiKey - Secured API key: Use secured API only when running on Node.JS server, otherwise you can expose your key
    * @param {boolean} enableSecuredMode - Indicates if secured mode is enabled globally. This can be overriden on query level
    * @param {retryAttempts} retryAttempts - Number of retry attempts when error occures
    */
    constructor(
        public projectId: string,
        public typeResolvers: TypeResolver[],
        private options?: {
            enableAdvancedLogging?: boolean,
            previewApiKey?: string,
            enablePreviewMode?: boolean,
            defaultLanguage?: string,
            baseUrl?: string,
            basePreviewUrl?: string,
            securedApiKey?: string,
            enableSecuredMode?: boolean,
            retryAttempts?: number
        }) {

        if (!projectId) {
            throw Error(`Cannot create delivery configuration without 'projectId'`);
        }

        if (!typeResolvers) {
            throw Error(`Cannot create delivery configuration without specifying 'typeResolvers'`);
        }

        if (options) {
            Object.assign(this, options);
        }
    }
}
