import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { ContentItemSystemAttributes } from '../models/item/content-item-system-attributes';
import { DeliveryClientConfig } from '../config/delivery-client.config';

export class TypeResolverService {

    constructor(
        private readonly config: DeliveryClientConfig
    ) {
    }

    /**
     * Creates empty typed object of given type
     * @param type Type of the content item
     */
    createEmptyTypedObj<TItem extends IContentItem>(type: string): TItem {
        if (!type) {
            throw Error('Cannot resolve type because no type name was provided');
        }

        var typeResolver = this.config.typeResolvers.find(m => m.type === type);

        if (!typeResolver) {
            throw Error(`Cannot find resolver for type '${type}'`);
        }

        return typeResolver.resolve() as TItem;
    }

    /**
     * Takes given type name and creates a strongly typed model based specified in client configuration
     * @param type Type of the content item 
     * @param item Typed content item
     */
    createTypedObj<TItem extends IContentItem>(type: string, item: IContentItem): TItem {
        var typedItem = this.createEmptyTypedObj<TItem>(type);

        // use typed 'system' property
        typedItem.system = new ContentItemSystemAttributes(
            item.system.id,
            item.system.name,
            item.system.codename,
            item.system.type,
            item.system.last_modified,
            item.system.language,
            item.system.sitemap_locations
        );

        return typedItem;
    }
}