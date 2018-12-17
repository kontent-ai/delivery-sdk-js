import { IContentManagementClientConfig } from '../../config';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class DataQuery<TQuery extends BaseQuery<any>, TData> {

    constructor(
        protected config: IContentManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected constructQuery: (
            config: IContentManagementClientConfig,
            queryService: ContentManagementQueryService,
            data: TData) => TQuery
    ) {
    }

    /**
     * Gets query with data
     * @param data Data for query
     */
    withData(data: TData): TQuery {
        return this.constructQuery(this.config, this.queryService, data);
    }
}
