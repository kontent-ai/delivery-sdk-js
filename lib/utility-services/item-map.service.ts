import { FieldMapService } from './field-map.service';
import { IItem } from '../interfaces/item/iitem.interface';
import { ICloudResponseSingle, ICloudResponseMultiple } from '../interfaces/item/cloud-responses';
import { TypeResolver } from '../models/item/type-resolver.class';
import { TypeResolverService } from './type-resolver.service';

export class ItemMapService {

    private fieldMapService: FieldMapService;

    constructor(
        private typeResolvers: TypeResolver[],
    ) {
        this.fieldMapService = new FieldMapService(new TypeResolverService(typeResolvers));
    }

    private mapItem<TItem extends IItem>(item: IItem, modularContent: any): TItem {
        if (!item) {
            return null;
        }

        return this.fieldMapService.mapFields(item, modularContent);
    }

    mapSingleItem<TItem extends IItem>(response: ICloudResponseSingle): TItem {
        return this.mapItem<TItem>(response.item, response.modular_content);
    }

    mapMultipleItems<TItem extends IItem>(response: ICloudResponseMultiple): TItem[] {
        var that = this;
        return response.items.map(function (item) {
            return that.mapItem<TItem>(item, response.modular_content);
        });
    }
}