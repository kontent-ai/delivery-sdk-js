import { IQueryConfig } from '../../interfaces/common/iquery.config';

export class QueryConfig implements IQueryConfig {

    public usePreviewMode?: boolean;

    constructor(
        private options?: {
            usePreviewMode?: boolean
        }
    ) {
        if (options) Object.assign(this, options);
    }
}
