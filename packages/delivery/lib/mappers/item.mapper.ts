import { IDeliveryClientConfig } from '../config';
import { ItemContracts } from '../data-contracts';
import { IItemQueryConfig } from '../interfaces';
import { FieldMapper } from '../mappers';
import { ContentItem } from '../models';
import { IRichTextHtmlParser } from '../parser';

export class ItemMapper {

    private readonly fieldMapper: FieldMapper;

    constructor(
        private readonly config: IDeliveryClientConfig,
        private readonly richTextHtmlParser: IRichTextHtmlParser
    ) {
        this.fieldMapper = new FieldMapper(config, richTextHtmlParser);
    }

    /**
     * Maps single item to its proper strongly typed model from the given Cloud response
     * @param response Cloud response used to map the item
     * @param queryConfig Query configuration
     */
    mapSingleItem<TItem extends ContentItem>(response: ItemContracts.IItemResponseContract, queryConfig: IItemQueryConfig): TItem {
        return this.mapItem<TItem>(response.item, response.modular_content, queryConfig);
    }

    /**
    * Maps multiple items to their strongly typed model from the given Cloud response
    * @param response Cloud response used to map the item
    * @param queryConfig Query configuration
    */
    mapMultipleItems<TItem extends ContentItem>(response: ItemContracts.IItemsResponseContract, queryConfig: IItemQueryConfig): TItem[] {
        const that = this;

        return response.items.map(function (item) {
            return that.mapItem<TItem>(item, response.modular_content, queryConfig);
        });
    }

    private mapItem<TItem extends ContentItem>(item: ItemContracts.IContentItemContract, modularContent: any, queryConfig: IItemQueryConfig): TItem {
        if (item == null) {
            throw Error(`Could not map item because its undefined`);
        }
        return this.fieldMapper.mapFields<TItem>(item, modularContent, queryConfig, []);
    }
}
