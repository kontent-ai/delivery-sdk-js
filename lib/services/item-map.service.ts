import { FieldMapService } from './field-map.service';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { ICloudResponseSingle, ICloudResponseMultiple } from '../interfaces/item/cloud-responses';
import { TypeResolver } from '../models/item/type-resolver.class';
import { TypeResolverService } from './type-resolver.service';
import { IModularContent } from '../interfaces/item/imodular-content.interface';
import { DeliveryClientConfig } from '../config/delivery-client.config';

export class ItemMapService {

    private fieldMapService: FieldMapService;

    constructor(
        private config: DeliveryClientConfig,
    ) {
        this.fieldMapService = new FieldMapService(config);
    }

    private mapItem<TItem extends IContentItem>(item: IContentItem, modularContent: any): TItem {
        if (!item) {
            return null;
        }

        return this.fieldMapService.mapFields(item, modularContent);
    }

    mapSingleItem<TItem extends IContentItem>(response: ICloudResponseSingle): TItem {
        return this.mapItem<TItem>(response.item, response.modular_content);
    }

    mapMultipleItems<TItem extends IContentItem>(response: ICloudResponseMultiple): TItem[] {
        var that = this;

        return response.items.map(function (item) {
            return that.mapItem<TItem>(item, response.modular_content);
        });
    }
}