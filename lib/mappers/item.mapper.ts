import { IDeliveryClientConfig } from '../config';
import { ItemContracts } from '../data-contracts';
import { IContentItem, IContentItemsContainer, IItemQueryConfig } from '../models';
import { IRichTextHtmlParser } from '../parser';
import { stronglyTypedResolver } from '../resolvers';
import { ElementMapper } from './element.mapper';

export interface IMapItemResult<TItem extends IContentItem = IContentItem> {
    item: TItem;
    processedItems: IContentItemsContainer;
    preparedItems: IContentItemsContainer;
    processingStartedForCodenames: string[];
}

export interface IMultipleItemsMapResult<TItem extends IContentItem = IContentItem> {
    items: TItem[];
    linkedItems: IContentItemsContainer;
}

export interface ISingleItemMapResult<TItem extends IContentItem = IContentItem> {
    item: TItem;
    linkedItems: IContentItemsContainer;
}

export class ItemMapper {
    private readonly elementMapper: ElementMapper;

    constructor(readonly config: IDeliveryClientConfig, readonly richTextHtmlParser: IRichTextHtmlParser) {
        this.elementMapper = new ElementMapper(config, richTextHtmlParser);
    }

    /**
     * Maps single item to its proper strongly typed model from the given Kontent response
     * @param response Kontent response used to map the item
     * @param queryConfig Query configuration
     */
    mapSingleItemFromResponse<TItem extends IContentItem = IContentItem>(
        response: ItemContracts.IViewContentItemContract,
        queryConfig: IItemQueryConfig
    ): ISingleItemMapResult<TItem> {
        const mapResult = this.mapItems<TItem>({
            mainItems: [response.item],
            linkedItems: Object.values(response.modular_content),
            queryConfig: queryConfig
        });

        return {
            item: mapResult.items[0],
            linkedItems: mapResult.linkedItems
        };
    }

    /**
     * Maps multiple items to their strongly typed model from the given Kontent response
     * @param response Kontent response used to map the item
     * @param queryConfig Query configuration
     */
    mapMultipleItemsFromResponse<TItem extends IContentItem = IContentItem>(
        response: ItemContracts.IItemsWithModularContentContract,
        queryConfig: IItemQueryConfig
    ): IMultipleItemsMapResult<TItem> {
        const mapResult = this.mapItems<TItem>({
            mainItems: response.items,
            linkedItems: Object.values(response.modular_content),
            queryConfig: queryConfig
        });

        return mapResult;
    }

    /**
     * Maps item contracts to full models
     */
    mapItems<TItem extends IContentItem = IContentItem>(data: {
        mainItems: ItemContracts.IContentItemContract[];
        linkedItems: ItemContracts.IContentItemContract[];
        queryConfig: IItemQueryConfig;
    }): IMultipleItemsMapResult<TItem> {
        const that = this;
        const itemResolver =
            data.queryConfig && data.queryConfig.itemResolver ? data.queryConfig.itemResolver : undefined;
        const processedItems: IContentItemsContainer = {};
        const preparedItems: IContentItemsContainer = {};
        const processingStartedForCodenames: string[] = [];
        const mappedMainItems: TItem[] = [];
        const mappedLinkedItems: IContentItemsContainer = {};
        const itemsToResolve: ItemContracts.IContentItemContract[] = [...data.mainItems, ...data.linkedItems];

        // first prepare reference for all items
        for (const item of itemsToResolve) {
            preparedItems[item.system.codename] = stronglyTypedResolver.createItemInstance(
                {
                    item: item
                },
                this.config.typeResolvers || [],
                itemResolver
            );
        }

        // then resolve items
        for (const item of data.mainItems) {
            const itemResult = that.mapItem<TItem>({
                item: item,
                processedItems: processedItems,
                queryConfig: data.queryConfig,
                preparedItems: preparedItems,
                processingStartedForCodenames: processingStartedForCodenames
            });

            mappedMainItems.push(itemResult.item);
        }

        for (const item of data.linkedItems) {
            const itemResult = that.mapItem<TItem>({
                item: item,
                processedItems: processedItems,
                queryConfig: data.queryConfig,
                preparedItems: preparedItems,
                processingStartedForCodenames: processingStartedForCodenames
            });

            mappedLinkedItems[item.system.codename] = itemResult.item;
        }

        return {
            items: mappedMainItems,
            linkedItems: mappedLinkedItems
        };
    }

    /**
     * Maps item contract to full model
     */
    private mapItem<TItem extends IContentItem = IContentItem>(data: {
        item: ItemContracts.IContentItemContract;
        queryConfig: IItemQueryConfig;
        processedItems: IContentItemsContainer;
        processingStartedForCodenames: string[];
        preparedItems: IContentItemsContainer;
    }): IMapItemResult<TItem> {
        if (!data.item) {
            throw Error(`Could not map item because its undefined`);
        }

        const result = this.elementMapper.mapElements<TItem>({
            item: data.item,
            preparedItems: data.preparedItems,
            processingStartedForCodenames: [],
            processedItems: data.processedItems,
            queryConfig: data.queryConfig
        });

        if (!result) {
            throw Error(`Mapping of content item '${data.item.system.codename}' failed`);
        }
        return {
            item: result.item,
            processedItems: result.processedItems,
            preparedItems: result.preparedItems,
            processingStartedForCodenames: result.processingStartedForCodenames
        };
    }
}
