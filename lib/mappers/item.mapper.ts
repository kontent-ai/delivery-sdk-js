import { codenameHelper } from '../utilities';
import { IDeliveryClientConfig } from '../config';
import { Contracts } from '../contracts';
import {
    IContentItem,
    IContentItemsContainer,
    IContentItemWithRawDataContainer,
    IContentItemWithRawElements
} from '../models';
import { ElementMapper } from './element.mapper';

export interface IMapItemResult<
    TContentItem extends IContentItem = IContentItem,
    TLinkedItemType extends IContentItem = IContentItem
> {
    item: TContentItem;
    processedItems: IContentItemsContainer<TLinkedItemType>;
    preparedItems: IContentItemWithRawDataContainer;
    processingStartedForCodenames: string[];
}

export interface IMultipleItemsMapResult<
    TContentItem extends IContentItem = IContentItem,
    TLinkedItemType extends IContentItem = IContentItem
> {
    items: TContentItem[];
    linkedItems: IContentItemsContainer<TLinkedItemType>;
}

export interface ISingleItemMapResult<
    TContentItem extends IContentItem = IContentItem,
    TLinkedItemType extends IContentItem = IContentItem
> {
    item: TContentItem;
    linkedItems: IContentItemsContainer<TLinkedItemType>;
}

export class ItemMapper<TContentItemType extends IContentItem> {
    private readonly elementMapper: ElementMapper<TContentItemType>;

    constructor(readonly config: IDeliveryClientConfig) {
        this.elementMapper = new ElementMapper(config);
    }

    /**
     * Maps single item to its proper strongly typed model from the given response
     * @param response Response used to map the item
     * @param queryConfig Query configuration
     */
    mapSingleItemFromResponse<TContentItem extends TContentItemType = TContentItemType>(
        response: Contracts.IViewContentItemContract
    ): ISingleItemMapResult<TContentItem, TContentItemType> {
        const mapResult = this.mapItems<TContentItem>({
            mainItems: [response.item],
            linkedItems: Object.values(response.modular_content)
        });

        return {
            item: mapResult.items[0],
            linkedItems: mapResult.linkedItems
        };
    }

    /**
     * Maps multiple items to their strongly typed model from the given  response
     * @param response Response used to map the item
     * @param queryConfig Query configuration
     */
    mapMultipleItemsFromResponse<TContentItem extends TContentItemType = TContentItemType>(
        response: Contracts.IItemsWithModularContentContract
    ): IMultipleItemsMapResult<TContentItem, TContentItemType> {
        const mapResult = this.mapItems<TContentItem>({
            mainItems: response.items,
            linkedItems: Object.values(response.modular_content)
        });

        return mapResult;
    }

    /**
     * Maps item contracts to full models
     */
    mapItems<TContentItem extends TContentItemType = TContentItemType>(data: {
        mainItems: Contracts.IContentItemContract[];
        linkedItems: Contracts.IContentItemContract[];
    }): IMultipleItemsMapResult<TContentItem, TContentItemType> {
        const processedItems: IContentItemsContainer<TContentItem> = {};
        const preparedItems: IContentItemWithRawDataContainer = {};
        const processingStartedForCodenames: string[] = [];
        const mappedMainItems: TContentItem[] = [];
        const mappedLinkedItems: IContentItemsContainer<TContentItem> = {};
        const itemsToResolve: Contracts.IContentItemContract[] = [...data.mainItems, ...data.linkedItems];

        // first prepare reference for all items
        for (const item of itemsToResolve) {
            preparedItems[codenameHelper.escapeCodenameInCodenameIndexer(item.system.codename)] = {
                item: this.createContentItem(item),
                rawItem: item
            };
        }

        // then resolve main items
        for (const item of data.mainItems) {
            const itemResult = this.mapItem<TContentItem>({
                item: preparedItems[codenameHelper.escapeCodenameInCodenameIndexer(item.system.codename)],
                processedItems: processedItems,
                preparedItems: preparedItems,
                processingStartedForCodenames: processingStartedForCodenames
            });
            mappedMainItems.push(itemResult.item);
        }

        // and linked items
        for (const item of data.linkedItems) {
            const itemResult = this.mapItem<TContentItem>({
                item: preparedItems[codenameHelper.escapeCodenameInCodenameIndexer(item.system.codename)],
                processedItems: processedItems,
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
    private mapItem<TContentItem extends TContentItemType = TContentItemType>(data: {
        item: IContentItemWithRawElements;
        processedItems: IContentItemsContainer<TContentItem>;
        processingStartedForCodenames: string[];
        preparedItems: IContentItemWithRawDataContainer;
    }): IMapItemResult<TContentItem, TContentItemType> {
        if (!data.item) {
            throw Error(`Could not map item because its undefined`);
        }

        const result = this.elementMapper.mapElements<TContentItem>({
            dataToMap: data.item,
            preparedItems: data.preparedItems,
            processingStartedForCodenames: [],
            processedItems: data.processedItems
        });

        if (!result) {
            throw Error(`Mapping of content item '${data.item.item.system.codename}' failed`);
        }
        return {
            item: result.item,
            processedItems: result.processedItems,
            preparedItems: result.preparedItems,
            processingStartedForCodenames: result.processingStartedForCodenames
        };
    }

    private createContentItem(item: Contracts.IContentItemContract): IContentItem {
        const contentItem: IContentItem = {
            elements: {},
            system: {
                codename: item.system.codename,
                collection: item.system.collection,
                id: item.system.id,
                language: item.system.language,
                lastModified: item.system.last_modified,
                name: item.system.name,
                sitemapLocations: item.system.sitemap_locations,
                type: item.system.type,
                workflowStep: item.system.workflow_step ?? null,
                workflow: item.system.workflow ?? null
            }
        };

        return contentItem;
    }
}
