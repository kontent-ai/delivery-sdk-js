export interface ITrackingClientConfig {
    /**
     * Kentico Cloud project id
     */
    projectId: string;

    /**
     * Base Url. Can be overriden if e.g. a proxy is required
     */
    baseUrl?: string;

    /**
    * Number of retry attempts when error occures. When not set, default number of attempts (3) are used. To disable set to 0.
    */
    retryAttempts?: number;

    /**
    * Indicates if advanced (developer's) issues are logged in console. Enable for development and disable in production
    */
    enableAdvancedLogging?: boolean;
}
