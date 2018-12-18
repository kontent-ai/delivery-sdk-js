import { IContentManagementClientConfig } from '../../config';
import { ContentManagementQueryService } from '../../services';

export class DataQuery<TResult, TData> {

    constructor(
        protected config: IContentManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected constructQuery: (
            config: IContentManagementClientConfig,
            queryService: ContentManagementQueryService,
            data: TData) => TResult
    ) {
    }

    /**
     * Gets query with data
     * @param data Data for query
     */
    withData(data: TData): TResult {
        return this.constructQuery(this.config, this.queryService, data);
    }
}
