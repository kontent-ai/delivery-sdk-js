import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    Filters,
    IContentItem,
    IDeliveryNetworkResponse,
    Parameters,
    Responses,
    IItemFeedQueryConfig
} from '../../models';
import { QueryService } from '../../services';
import { BaseItemListingQuery } from '../common/base-item-listing-query.class';
import { ElementType, Elements } from '../../elements';

export class ItemsFeedQuery<TContentItem extends IContentItem = IContentItem> extends BaseItemListingQuery<
    Responses.IListItemsFeedResponse<TContentItem>,
    Responses.IListItemsFeedAllResponse<TContentItem>,
    IItemFeedQueryConfig,
    Contracts.IItemsFeedContract
> {
    protected _queryConfig: IItemFeedQueryConfig = {};

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Gets only item of given type
     * @param type Codename of type to get
     */
    type(type: string): this {
        this.parameters.push(new Filters.TypeFilter(type));
        return this;
    }

    /**
     * Gets items of given types (logical or)
     * I.e. get items of either 'Actor' or 'Movie' type
     * @param types Types to get
     */
    types(types: string[]): this {
        this.parameters.push(new Filters.TypeFilter(types));
        return this;
    }

    /**
     * Gets only item from given collection
     * @param collection Codename of collection to get
     */
    collection(collection: string): this {
        this.parameters.push(new Filters.CollectionFilter(collection));
        return this;
    }

    /**
     * Gets items from given collections (logical or)
     * I.e. get items of either 'default' or 'christmas-campaign' collection
     * @param collections Collections to get
     */
    collections(collections: string[]): this {
        this.parameters.push(new Filters.CollectionFilter(collections));
        return this;
    }

    /**
     * Language codename
     * @param languageCodename Codename of the language
     */
    languageParameter(languageCodename: string): this {
        this.parameters.push(new Parameters.LanguageParameter(languageCodename));
        return this;
    }

    /**
     * Used to limit the number of elements returned by query.
     * @param elementCodenames Array of element codenames to fetch
     */
    elementsParameter(elementCodenames: string[]): this {
        this.parameters.push(new Parameters.ElementsParameter(elementCodenames));
        return this;
    }

    toPromise(): Promise<
        IDeliveryNetworkResponse<Responses.IListItemsFeedResponse<TContentItem>, Contracts.IItemsFeedContract>
    > {
        return this.queryService.getItemsFeed(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/items-feed';

        // add default language is necessary
        this.processDefaultLanguageParameter();

        return super.resolveUrlInternal(action);
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: IItemFeedQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    map(json: any): Responses.IListItemsFeedResponse<TContentItem> {
        return this.queryService.mappingService.itemsFeedResponse(json);
    }

    protected allResponseFactory(
        items: TContentItem[],
        responses: IDeliveryNetworkResponse<
            Responses.IListItemsFeedResponse<TContentItem>,
            Contracts.IItemsFeedContract
        >[]
    ): Responses.IListItemsFeedAllResponse<TContentItem> {
        if (this.canLinkItems()) {
            this.linkItems(items, responses);
        }

        return {
            items: items,
            responses: responses
        };
    }

    private linkItems(
        items: TContentItem[],
        responses: IDeliveryNetworkResponse<
            Responses.IListItemsFeedResponse<TContentItem>,
            Contracts.IItemsFeedContract
        >[]
    ): void {
        // prepare all available items (including components) for linking
        const allContentItems: IContentItem[] = [];

        // process linked items (modular_content part of the response)
        for (const response of responses) {
            allContentItems.push(...Object.values(response.data.linkedItems));
        }

        // add standard items
        for (const item of items) {
            if (!allContentItems.find((m) => m.system.codename.toLowerCase() === item.system.codename.toLowerCase())) {
                allContentItems.push(item);
            }
        }
        // process main items
        for (const item of allContentItems) {
            for (const elementKey of Object.keys(item.elements)) {
                const element = item.elements[elementKey];

                if (element.type === ElementType.ModularContent) {
                    const linkedItemElement = element as Elements.LinkedItemsElement;

                    for (const linkedItemCodename of linkedItemElement.value) {
                        if (
                            !linkedItemElement.linkedItems.find(
                                (m) => m.system.codename.toLowerCase() === linkedItemCodename.toLowerCase()
                            )
                        ) {
                            const linkedItem = allContentItems.find(
                                (m) => m.system.codename.toLowerCase() === linkedItemCodename.toLowerCase()
                            );

                            if (linkedItem) {
                                linkedItemElement.linkedItems.push(linkedItem);
                            }
                        }
                    }
                }

                if (element.type === ElementType.RichText) {
                    const richTextElement = element as Elements.RichTextElement;

                    for (const linkedItemCodename of richTextElement.linkedItemCodenames) {
                        if (
                            !richTextElement.linkedItems.find(
                                (m) => m.system.codename.toLowerCase() === linkedItemCodename.toLowerCase()
                            )
                        ) {
                            const linkedItem = allContentItems.find(
                                (m) => m.system.codename.toLowerCase() === linkedItemCodename.toLowerCase()
                            );

                            if (linkedItem) {
                                richTextElement.linkedItems.push(linkedItem);
                            }
                        }
                    }
                }
            }
        }
    }

    private canLinkItems(): boolean {
        if (this.config.linkedItemsReferenceHandler === 'ignore') {
            return false;
        }

        if (this._queryConfig.disableItemLinking === true) {
            return false;
        }

        return true;
    }
}
