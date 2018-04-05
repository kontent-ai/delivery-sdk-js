import { IDeliveryClientConfig } from '../config/delivery-client.config';
import { CloudItemResponseInterfaces } from '../interfaces/item/cloud-responses';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { IRichTextHtmlParser } from '../parser';
import { FieldMapper } from './field.mapper';

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
    mapSingleItem<TItem extends IContentItem>(response: CloudItemResponseInterfaces.ICloudResponseSingle, queryConfig: IItemQueryConfig): TItem {
        return this.mapItem<TItem>(response.item, response.modular_content, queryConfig);
    }

    /**
    * Maps multiple items to their strongly typed model from the given Cloud response
    * @param response Cloud response used to map the item
    * @param queryConfig Query configuration
    */
    mapMultipleItems<TItem extends IContentItem>(response: CloudItemResponseInterfaces.ICloudResponseMultiple, queryConfig: IItemQueryConfig): TItem[] {
        const that = this;

        return response.items.map(function (item) {
            return that.mapItem<TItem>(item, response.modular_content, queryConfig);
        });
    }

    private mapItem<TItem extends IContentItem>(item: IContentItem, modularContent: any, queryConfig: IItemQueryConfig): TItem {
        if (item == null) {
            throw Error(`Could not map item because its undefined`);
        }
        return this.fieldMapper.mapFields<TItem>(item, modularContent, queryConfig, []);
    }
}
