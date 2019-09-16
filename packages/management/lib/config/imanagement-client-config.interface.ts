import { IHttpService } from '@kentico/kontent-core';

export interface IManagementClientConfig {
    /**
     * Kentico Kontent project id
     */
    projectId: string;

    /**
     * Content management API key
     */
    apiKey: string;

    /**
     * Base Url. Can be overriden if e.g. a proxy is required
     */
    baseUrl?: string;

    /**
    * Number of retry attempts when error occures. When not set, default number of attempts (3) are used. To disable set to 0.
    */
    retryAttempts?: number;

     /**
     * Can be used to inject custom Http service to perform requests
     */
    httpService?: IHttpService;

    /**
    * Array of request status codes that should be retried
    */
    retryStatusCodes?: number[];
}
