import { IDeliveryClientConfig } from '../config';
import { ItemContracts } from '../data-contracts';
import { IContentItem, IContentItemsContainer, IContentItemWithRawDataContainer, IContentItemWithRawElements, IItemQueryConfig } from '../models';
import { IRichTextHtmlParser } from '../parser';
import { ElementMapper } from './element.mapper';

export interface IMapItemResult<TContentItem extends IContentItem<any> = IContentItem<any>> {
    item: TContentItem;
    processedItems: IContentItemsContainer;
    preparedItems: IContentItemWithRawDataContainer;
    processingStartedForCodenames: string[];
}

export interface IMultipleItemsMapResult<TContentItem extends IContentItem<any> = IContentItem<any>> {
    items: TContentItem[];
    linkedItems: IContentItemsContainer;
}

export interface ISingleItemMapResult<TContentItem extends IContentItem<any> = IContentItem<any>> {
    item: TContentItem;
    linkedItems: IContentItemsContainer;
}

export class ItemMapper {
    private readonly elementMapper: ElementMapper;

    constructor(readonly config: IDeliveryClientConfig, readonly richTextHtmlParser: IRichTextHtmlParser) {
        this.elementMapper = new ElementMapper(config);
    }

    /**
     * Maps single item to its proper strongly typed model from the given Kontent response
     * @param response Kontent response used to map the item
     * @param queryConfig Query configuration
     */
    mapSingleItemFromResponse<TContentItem extends IContentItem<any> = IContentItem<any>>(
        response: ItemContracts.IViewContentItemContract,
        queryConfig: IItemQueryConfig
    ): ISingleItemMapResult<TContentItem> {
        const mapResult = this.mapItems<TContentItem>({
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
    mapMultipleItemsFromResponse<TContentItem extends IContentItem<any> = IContentItem<any>>(
        response: ItemContracts.IItemsWithModularContentContract,
        queryConfig: IItemQueryConfig
    ): IMultipleItemsMapResult<TContentItem> {
        const mapResult = this.mapItems<TContentItem>({
            mainItems: response.items,
            linkedItems: Object.values(response.modular_content),
            queryConfig: queryConfig
        });

        return mapResult;
    }

    /**
     * Maps item contracts to full models
     */
    mapItems<TContentItem extends IContentItem<any> = IContentItem<any>>(data: {
        mainItems: ItemContracts.IContentItemContract[];
        linkedItems: ItemContracts.IContentItemContract[];
        queryConfig: IItemQueryConfig;
    }): IMultipleItemsMapResult<TContentItem> {
        const that = this;
        const processedItems: IContentItemsContainer = {};
        const preparedItems: IContentItemWithRawDataContainer = {};
        const processingStartedForCodenames: string[] = [];
        const mappedMainItems: TContentItem[] = [];
        const mappedLinkedItems: IContentItemsContainer = {};
        const itemsToResolve: ItemContracts.IContentItemContract[] = [...data.mainItems, ...data.linkedItems];

        // first prepare reference for all items
        for (const item of itemsToResolve) {
            preparedItems[item.system.codename] = {
                item: this.createContentItem(item),
                rawItem: item
            };
        }

        // then resolve items
        for (const item of data.mainItems) {
            const itemResult = that.mapItem<TContentItem>({
                item: preparedItems[item.system.codename],
                processedItems: processedItems,
                queryConfig: data.queryConfig,
                preparedItems: preparedItems,
                processingStartedForCodenames: processingStartedForCodenames
            });

            mappedMainItems.push(itemResult.item);
        }

        for (const item of data.linkedItems) {
            const itemResult = that.mapItem<TContentItem>({
                item: preparedItems[item.system.codename],
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
    private mapItem<TContentItem extends IContentItem<any> = IContentItem<any>>(data: {
        item: IContentItemWithRawElements;
        queryConfig: IItemQueryConfig;
        processedItems: IContentItemsContainer;
        processingStartedForCodenames: string[];
        preparedItems: IContentItemWithRawDataContainer;
    }): IMapItemResult<TContentItem> {
        if (!data.item) {
            throw Error(`Could not map item because its undefined`);
        }

        const result = this.elementMapper.mapElements<TContentItem>({
            dataToMap: data.item,
            preparedItems: data.preparedItems,
            processingStartedForCodenames: [],
            processedItems: data.processedItems,
            queryConfig: data.queryConfig
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

    private createContentItem(item: ItemContracts.IContentItemContract): IContentItem<any> {
        const contentItem: IContentItem<any> = {
            elements: {},
            system: {
                codename: item.system.codename,
                collection: item.system.collection,
                id: item.system.id,
                language: item.system.language,
                lastModified: new Date(item.system.last_modified),
                name: item.system.name,
                sitemapLocations: item.system.sitemap_locations,
                type: item.system.type,
                workflowStep: item.system.workflow_step
            }
        };
        return contentItem;
    }
}
