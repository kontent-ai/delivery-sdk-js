import { TypeResolver } from '../models/item/type-resolver.class';

export class DeliveryClientConfig {

    /**
    * Indicates if advanced (developer's) issues are logged in console. Enable for development and disable in production.
    */
    public enableAdvancedLogging: boolean = true;

    /**
    * Configuration of Kentico Cloud Delivery client
    * @constructor
    * @param {string} apiEndpoint - Url to Kentico Cloud Delivery endpoint
    * @param {FieldType} projectId - ProjectId of your Kentico Cloud project
    * @param {TypeResolver[]} typeResolvers - List of resolvers that are used to create strongly typed objects from Kentico Cloud response
    * @param {boolean} enableAdvancedLogging - Indicates if advanced (developer's) issues are logged in console. Enable for development and disable in production.
    */
    constructor(
        public apiEndpoint: string,
        public projectId: string,
        public typeResolvers: TypeResolver[],
        public options?: {
            enableAdvancedLogging?: boolean
        }) {
        if (options) Object.assign(this, options);
    }
}