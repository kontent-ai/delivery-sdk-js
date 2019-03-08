import { IDeliveryClientConfig } from '../config';
import { ItemContracts } from '../data-contracts';
import { IItemQueryConfig } from '../interfaces';
import { FieldMapper } from '../mappers';
import { ContentItem } from '../models';
import { IRichTextHtmlParser } from '../parser';

interface MapItemResult<TItem extends ContentItem> {
    item: TItem;
    processedItems: ContentItem[];
}

interface MapItemsResult<TItem extends ContentItem> {
    items: TItem[];
    processedItems: ContentItem[];
}

export class ItemMapper {

    private readonly fieldMapper: FieldMapper;

    constructor(
        readonly config: IDeliveryClientConfig,
        readonly richTextHtmlParser: IRichTextHtmlParser
    ) {
        this.fieldMapper = new FieldMapper(config, richTextHtmlParser);
    }

    /**
     * Maps single item to its proper strongly typed model from the given Cloud response
     * @param response Cloud response used to map the item
     * @param queryConfig Query configuration
     */
    mapSingleItem<TItem extends ContentItem>(response: ItemContracts.IItemResponseContract, queryConfig: IItemQueryConfig): MapItemResult<TItem> {
        return this.mapItem<TItem>(response.item, response.modular_content, queryConfig, []);
    }

    /**
    * Maps multiple items to their strongly typed model from the given Cloud response
    * @param response Cloud response used to map the item
    * @param queryConfig Query configuration
    */
    mapMultipleItems<TItem extends ContentItem>(response: ItemContracts.IItemsResponseContract, queryConfig: IItemQueryConfig): MapItemsResult<TItem> {
        const that = this;

        const processedItems: ContentItem[] = [];
        const mappedItems: TItem[] = [];

        response.items.forEach((item) => {
            const mappedItem = that.mapItem<TItem>(item, response.modular_content, queryConfig, processedItems);
            mappedItems.push(mappedItem.item);
        });

        return {
            items: mappedItems,
            processedItems: processedItems // processed items are filled by reference (see mapItem)
        };
    }

    private mapItem<TItem extends ContentItem>(item: ItemContracts.IContentItemContract, modularContent: any, queryConfig: IItemQueryConfig, processedItems: ContentItem[]): MapItemResult<TItem> {
        if (!item) {
            throw Error(`Could not map item because its undefined`);
        }

        const result = this.fieldMapper.mapFields<TItem>(item, modularContent, queryConfig, processedItems, []);

        return {
            item: result.item,
            processedItems: result.processedItems
        };
    }
}
