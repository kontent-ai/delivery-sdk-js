import { FieldMapService } from './field-map.service';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { ICloudResponseSingle, ICloudResponseMultiple } from '../interfaces/item/cloud-responses';
import { TypeResolver } from '../models/item/type-resolver.class';
import { TypeResolverService } from './type-resolver.service';
import { IModularContent } from '../interfaces/item/imodular-content.interface';
import { DeliveryClientConfig } from '../config/delivery-client.config';
import { IQueryConfig } from '../interfaces/item/iquery.config';

export class ItemMapService {

    private fieldMapService: FieldMapService;

    constructor(
        private config: DeliveryClientConfig,
    ) {
        this.fieldMapService = new FieldMapService(config);
    }

    private mapItem<TItem extends IContentItem>(item: IContentItem, modularContent: any, queryConfig: IQueryConfig): TItem {
        if (!item) {
            return null;
        }

        return this.fieldMapService.mapFields(item, modularContent, queryConfig);
    }

    mapSingleItem<TItem extends IContentItem>(response: ICloudResponseSingle, queryConfig: IQueryConfig): TItem {
        return this.mapItem<TItem>(response.item, response.modular_content, queryConfig);
    }

    mapMultipleItems<TItem extends IContentItem>(response: ICloudResponseMultiple, queryConfig: IQueryConfig): TItem[] {
        var that = this;

        return response.items.map(function (item) {
            return that.mapItem<TItem>(item, response.modular_content, queryConfig);
        });
    }
}