import { FieldMapService } from './field-map.service';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { CloudItemResponseInterfaces } from '../interfaces/item/cloud-responses';
import { TypeResolverService } from './type-resolver.service';
import { IModularContent } from '../interfaces/item/imodular-content.interface';
import { DeliveryClientConfig } from '../config/delivery-client.config';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';

export class ItemMapService {

    private fieldMapService: FieldMapService;

    constructor(
        private config: DeliveryClientConfig,
    ) {
        this.fieldMapService = new FieldMapService(config);
    }

    private mapItem<TItem extends IContentItem>(item: IContentItem, modularContent: any, queryConfig: IItemQueryConfig): TItem {
        if (!item) {
            return null;
        }
        return this.fieldMapService.mapFields<TItem>(item, modularContent, queryConfig);
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
        var that = this;

        return response.items.map(function (item) {
            return that.mapItem<TItem>(item, response.modular_content, queryConfig);
        });
    }
}