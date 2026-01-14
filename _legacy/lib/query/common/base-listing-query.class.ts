import { IDeliveryClientConfig } from '../../config';
import {
    continuationTokenHeaderName,
    IGroupedNetworkResponse,
    IKontentListAllResponse,
    IKontentListResponse,
    IDeliveryNetworkResponse,
    IListAllQueryConfig,
    IQueryConfig,
    IContentItem,
    ClientTypes,
    IUsedInItemRecord,
    IContentType,
    ITaxonomyGroup,
    IContentItemDelta,
    ILanguage
} from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from './base-query.class';

type ListingRecord<TClientTypes extends ClientTypes> =
    | IContentItem
    | IContentItemDelta
    | IUsedInItemRecord<TClientTypes>
    | IContentType<TClientTypes['contentTypeCodenames']>
    | ILanguage<TClientTypes['languageCodenames']>
    | ITaxonomyGroup<TClientTypes['taxonomyCodenames']>;

export abstract class BaseListingQuery<
    TClientTypes extends ClientTypes,
    TRecord extends ListingRecord<TClientTypes>,
    TResponse extends IKontentListResponse,
    TAllResponse extends IKontentListAllResponse,
    TQueryConfig extends IQueryConfig,
    TContract
> extends BaseQuery<TClientTypes, TResponse, TQueryConfig, TContract> {
    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService<TClientTypes>) {
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
                if (nextPageUrl) {
                    this.withCustomUrl(nextPageUrl);
                }
                if (continuationToken) {
                    this.withContinuationToken(continuationToken);
                }

                return this.toPromise();
            }
        });
    }

    protected abstract allResponseFactory(
        items: TRecord[],
        responses: IDeliveryNetworkResponse<TResponse, TContract>[]
    ): TAllResponse;
}
