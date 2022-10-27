import { IDeliveryClientConfig } from '../../config';
import {
    continuationTokenHeaderName,
    IGroupedNetworkResponse,
    IKontentListAllResponse,
    IKontentListResponse,
    IDeliveryNetworkResponse,
    IListAllQueryConfig,
    IQueryConfig
} from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from './base-query.class';

export abstract class BaseListingQuery<
    TResponse extends IKontentListResponse,
    TAllResponse extends IKontentListAllResponse,
    TQueryConfig extends IQueryConfig,
    TContract
> extends BaseQuery<TResponse, TQueryConfig, TContract> {
    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Sets continuation token header
     */
    withContinuationToken(token: string): this {
        // remove previous continuation token if there is any
        let queryHeaders = this._queryConfig.customHeaders ?? [];
        queryHeaders = queryHeaders.filter((m) => m.header !== continuationTokenHeaderName);

        this._queryConfig.customHeaders = queryHeaders;

        this.withHeaders([
            {
                header: continuationTokenHeaderName,
                value: token
            }
        ]);

        return this;
    }

    /**
     * Query to get all items. Uses paging data and may execute multiple HTTP requests depending on number of items
     */
    toAllPromise(
        queryAllConfig?: IListAllQueryConfig<TResponse, TContract>
    ): Promise<IGroupedNetworkResponse<TAllResponse>> {
        return this.queryService.getListAllResponse<TResponse, TAllResponse, TContract>({
            page: 1,
            listQueryConfig: queryAllConfig,
            allResponseFactory: (items, responses) => {
                const response = this.allResponseFactory(items, responses);
                return {
                    data: response,
                    responses: responses
                };
            },
            getResponse: (nextPageUrl, continuationToken) => {
                let query = this;

                if (nextPageUrl) {
                    query = this.withCustomUrl(nextPageUrl);
                }
                if (continuationToken) {
                    query = this.withContinuationToken(continuationToken);
                }

                return query.toPromise();
            }
        });
    }

    protected abstract allResponseFactory(
        items: any[],
        responses: IDeliveryNetworkResponse<TResponse, TContract>[]
    ): TAllResponse;
}
