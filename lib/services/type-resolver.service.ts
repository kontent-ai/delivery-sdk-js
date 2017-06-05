import { TypeResolver } from '../models/item/type-resolver.class';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { ContentItemSystemAttributes } from '../models/item/content-item-system-attributes';
import { DeliveryClientConfig } from '../config/delivery-client.config';

export class TypeResolverService {

    constructor(
        private config: DeliveryClientConfig
    ) {
    }

    createTypedObj<TItem extends IContentItem>(type: string, item: IContentItem): TItem {
        if (!type) {
            throw Error('Cannot resolve type because no type name was provided');
        }

        var typeResolver = this.config.typeResolvers.find(m => m.type === type);

        if (!typeResolver) {
            throw Error(`Cannot find resolver for type '${type}'`);
        }

        var typedItem = typeResolver.resolve() as TItem;

        // use typed 'system' property
        typedItem.system = new ContentItemSystemAttributes(
            item.system.id,
            item.system.name,
            item.system.codename,
            item.system.type,
            item.system.last_modified
        );

        return typedItem;
    }
}