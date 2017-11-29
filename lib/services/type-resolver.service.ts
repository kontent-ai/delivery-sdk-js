import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { ContentItem } from '../models/item/content-item.class';
import { ContentItemSystemAttributes } from '../models/item/content-item-system-attributes';
import { DeliveryClientConfig } from '../config/delivery-client.config';

export class TypeResolverService {

    constructor(
        private readonly config: DeliveryClientConfig
    ) {
    }

    /**
     * Indicates if given type has a type resolver
     * @param type Type
     */
    hasTypeResolver(type: string): boolean {
        return !(!this.config.typeResolvers.find(m => m.type === type));
    }

    /**
     * Creates non generic ContentItem used when content type does not have a strongly typed model
     */
    createContentItem(item: IContentItem): ContentItem {
        const contentItem = new ContentItem();
        // use typed 'system' property
        contentItem.system = new ContentItemSystemAttributes(
            item.system.id,
            item.system.name,
            item.system.codename,
            item.system.type,
            item.system.last_modified,
            item.system.language,
            item.system.sitemap_locations
        );

        return contentItem;

    }

    /**
     * Takes given type name and creates a strongly typed model based specified in client configuration
     * @param type Type of the content item
     * @param item Typed content item
     */
    createTypedObj<TItem extends IContentItem>(type: string, item: IContentItem): TItem {
        const typedItem = this.createEmptyTypedObj<TItem>(type);

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

    /**
     * Creates empty typed object of given type
     * @param type Type of the content item
     */
    private createEmptyTypedObj<TItem extends IContentItem>(type: string): TItem {
        if (!type) {
            throw Error('Cannot resolve type because no type name was provided');
        }

        const typeResolver = this.config.typeResolvers.find(m => m.type === type);

        if (!typeResolver) {
            throw Error(`Cannot find resolver for type '${type}'. This error means that no class was registered as TypeResolver for this type. Caller of this method should first check if type is available.`);
        }

        return typeResolver.resolve() as TItem;
    }
}
