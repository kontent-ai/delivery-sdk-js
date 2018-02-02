import { IQueryConfig } from '../../interfaces/common/iquery.config';

export class QueryConfig implements IQueryConfig {

    /**
     * Indicates if preview mode is used
     */
    public usePreviewMode?: boolean;

    /**
    * Indicates if query should use secured delivery API mode. Overrides global settings of Delivery Client
    */
    public useSecuredMode?: boolean;

    /**
     * If the requested content has changed since the last request, the header determines whether
     * to wait while fetching content. This can be useful when retrieving changed content
     * in reaction to a webhook call. By default, when the header is not set, the API
     * serves old content (if cached by the CDN) while it's fetching the new content
     * to minimize wait time.
     */
    public waitForLoadingNewContent?: boolean;

    constructor(
        protected options?: {
            usePreviewMode?: boolean,
            waitForLoadingNewContent?: boolean,
            useSecuredMode?: boolean;
        }
    ) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
