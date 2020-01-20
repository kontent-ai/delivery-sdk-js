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
    mapSingleItem<TItem extends IContentItem = IContentItem>(
        response: ItemContracts.IViewContentItemContract,
        queryConfig: IItemQueryConfig
    ): ISingleItemMapResult<TItem> {
        const preparedItems: IContentItemsContainer = {};
        const itemResolver = queryConfig && queryConfig.itemResolver ? queryConfig.itemResolver : undefined;

        const preparedItem: IContentItem = stronglyTypedResolver.createItemInstance(
            {
                item: response.item,
                modularContent: response.modular_content
            },
            this.config.typeResolvers || [],
            itemResolver
        );

        preparedItems[response.item.system.codename] = preparedItem;

        for (const linkedItemCodename of Object.keys(response.modular_content)) {
            const item = response.modular_content[linkedItemCodename];
            preparedItems[linkedItemCodename] = stronglyTypedResolver.createItemInstance(
                {
                    item: item,
                    modularContent: response.modular_content
                },
                this.config.typeResolvers || [],
                itemResolver
            );
        }

        const mapResult = this.mapItem<TItem>({
            item: response.item,
            preparedItems: preparedItems,
            processedItems: {},
            processingStartedForCodenames: [],
            queryConfig: queryConfig
        });

        const linkedItems = this.extractLinkedItemsFromProcessedItems(response.modular_content, mapResult.processedItems);

        return {
            item: mapResult.item,
            linkedItems: linkedItems
        };
    }

    /**
     * Maps multiple items to their strongly typed model from the given Kontent response
     * @param response Kontent response used to map the item
     * @param queryConfig Query configuration
     */
    mapMultipleItems<TItem extends IContentItem = IContentItem>(
        response: ItemContracts.IItemsWithModularContentContract,
        queryConfig: IItemQueryConfig
    ): IMultipleItemsMapResult<TItem> {
        const that = this;
        const itemResolver = queryConfig && queryConfig.itemResolver ? queryConfig.itemResolver : undefined;
        const processedItems: IContentItemsContainer = {};
        const preparedItems: IContentItemsContainer = {};
        const processingStartedForCodenames: string[] = [];
        const mappedItems: TItem[] = [];

        // prepare future reference for items
        for (const item of response.items) {
            preparedItems[item.system.codename] = stronglyTypedResolver.createItemInstance(
                {
                    item: item,
                    modularContent: response.modular_content
                },
                this.config.typeResolvers || [],
                itemResolver
            );
        }
        for (const linkedItemCodename of Object.keys(response.modular_content)) {
            const item = response.modular_content[linkedItemCodename];
            preparedItems[linkedItemCodename] = stronglyTypedResolver.createItemInstance(
                {
                    item: item,
                    modularContent: response.modular_content
                },
                this.config.typeResolvers || [],
                itemResolver
            );
        }

        response.items.forEach(item => {
            const itemResult = that.mapItem<TItem>({
                item: item,
                processedItems: processedItems,
                queryConfig: queryConfig,
                preparedItems: preparedItems,
                processingStartedForCodenames: processingStartedForCodenames
            });
            mappedItems.push(itemResult.item);
        });

        const linkedItems = this.extractLinkedItemsFromProcessedItems(response.modular_content, processedItems);

        return {
            items: mappedItems,
            linkedItems: linkedItems
        };
    }

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
            if (!result) {
                throw Error(`Mapping of content iteam '${data.item.system.codename}' failed`);
            }
        }
        return {
            item: result.item,
            processedItems: result.processedItems,
            preparedItems: result.preparedItems,
            processingStartedForCodenames: result.processingStartedForCodenames
        };
    }

    private extractLinkedItemsFromProcessedItems(
        modular_content: ItemContracts.IModularContentContract,
        processedItems: IContentItemsContainer
    ): IContentItemsContainer {
        const linkedItems: IContentItemsContainer = {};
        for (const key of Object.keys(modular_content)) {
            linkedItems[key] = processedItems[key];
        }

        return linkedItems;
    }
}
