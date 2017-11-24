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
    * Indicates if preview mode is enabled globally
    */
    public enablePreviewMode: boolean = false;

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
    * Configuration of Kentico Cloud Delivery client
    * @constructor
    * @param {FieldType} projectId - ProjectId of your Kentico Cloud project
    * @param {TypeResolver[]} typeResolvers - List of resolvers that are used to create strongly typed objects from Kentico Cloud response
    * @param {boolean} enableAdvancedLogging - Indicates if advanced (developer's) issues are logged in console. Enable for development and disable in production.
    * @param {string} previewApiKey - Preview API key used to get unpublished content items
    * @param {boolean} enablePreviewMode - Indicates if preview mode is enabled globally
    * @param {string} defaultLanguage - Sets default language that will be used for all queries unless overriden with query parameters
    * @param {string} baseUrl - Can be used to configure custom base url
    * @param {string} basePreviewUrl - Can bse used to configure custom preview url
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
            basePreviewUrl?: string

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
