import { ElementType, Elements } from '../../elements';
import { IDeliveryClientConfig } from '../../config';
import {
    continuationTokenHeaderName,
    IGroupedNetworkResponse,
    IKontentListAllResponse,
    IKontentListResponse,
    IDeliveryNetworkResponse,
    IListAllQueryConfig,
    IQueryConfig,
    IContentItem
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
        items: IContentItem[],
        responses: IDeliveryNetworkResponse<TResponse, TContract>[]
    ): TAllResponse;

    protected linkItemsInRte(allContentItems: IContentItem[]): void {
        for (const item of allContentItems) {
            for (const elementKey of Object.keys(item.elements)) {
                const element = item.elements[elementKey];

                if (element.type === ElementType.ModularContent) {
                    const linkedItemElement = element as Elements.LinkedItemsElement;

                    // We create separate array for ordered items because the 'linkedItems' from response might be incomplete
                    // e.g. If 4 items are linked, only 2 might be available in the response. Rest needs to be mapped from all available items
                    const orderedLinkedItems: IContentItem[] = [];

                    for (const linkedItemCodename of linkedItemElement.value) {
                        let linkedItem: IContentItem | undefined;

                        const linkedItemInElement = linkedItemElement.linkedItems.find(
                            (m) => m.system.codename.toLowerCase() === linkedItemCodename.toLowerCase()
                        );
                        if (linkedItemInElement) {
                            linkedItem = linkedItemInElement;
                        } else {
                            linkedItem = allContentItems.find(
                                (m) => m.system.codename.toLowerCase() === linkedItemCodename.toLowerCase()
                            );
                        }

                        if (linkedItem) {
                            orderedLinkedItems.push(linkedItem);
                        }
                    }

                    // Replace linked items with the ordered one
                    linkedItemElement.linkedItems = orderedLinkedItems;
                }

                if (element.type === ElementType.RichText) {
                    const orderedLinkedItems: IContentItem[] = [];

                    const richTextElement = element as Elements.RichTextElement;

                    for (const linkedItemCodename of richTextElement.linkedItemCodenames) {
                        let linkedItem: IContentItem | undefined;

                        const linkedItemInElement = richTextElement.linkedItems.find(
                            (m) => m.system.codename.toLowerCase() === linkedItemCodename.toLowerCase()
                        );
                        if (linkedItemInElement) {
                            linkedItem = linkedItemInElement;
                        } else {
                            linkedItem = allContentItems.find(
                                (m) => m.system.codename.toLowerCase() === linkedItemCodename.toLowerCase()
                            );
                        }

                        if (linkedItem) {
                            orderedLinkedItems.push(linkedItem);
                        }
                    }

                    richTextElement.linkedItems = orderedLinkedItems;
                }
            }
        }
    }
}
