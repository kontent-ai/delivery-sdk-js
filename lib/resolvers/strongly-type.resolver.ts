import { ItemContracts } from '../data-contracts';
import { ContentItemSystemAttributes } from '../models/item/content-item-system-attributes';
import { ContentItem } from '../models/item/content-item.class';
import { TypeResolver } from '../models/item/type-resolver.class';

export class StronglyTypedResolver {

    /**
     * Indicates if given type has a type resolver
     * @param type Type
     * @param resolvers Type resolvers
     */
    hasTypeResolver(type: string, resolvers: TypeResolver[]): boolean {
        return !(!resolvers.find(m => m.type === type));
    }

    /**
     * Creates non generic ContentItem used when content type does not have a strongly typed model
     */
    createContentItem(item: ItemContracts.IContentItemContract): ContentItem {
        const contentItem = new ContentItem();
        // use typed 'system' property
        contentItem.system = new ContentItemSystemAttributes({
            name: item.system.name,
            codename: item.system.codename,
            id: item.system.id,
            lastModified: item.system.last_modified,
            language: item.system.language,
            type: item.system.type,
            sitemapLocations: item.system.sitemap_locations
        });

        return contentItem;
    }

    /**
     * Takes given type name and creates a strongly typed model based specified in client configuration
     * @param type Type of the content item
     * @param item Typed content item
     * @param resolvers Type resolvers
     */
    createTypedObj<TItem extends ContentItem>(type: string, item: ItemContracts.IContentItemContract, typeResolvers: TypeResolver[]): TItem {
        const typedItem = this.createEmptyTypedObj<TItem>(type, typeResolvers);

        // use typed 'system' property
        typedItem.system = new ContentItemSystemAttributes({
            name: item.system.name,
            codename: item.system.codename,
            id: item.system.id,
            lastModified: item.system.last_modified,
            language: item.system.language,
            type: item.system.type,
            sitemapLocations: item.system.sitemap_locations
        });

        return typedItem;
    }

    /**
     * Creates empty typed object of given type
     * @param type Type of the content item
     * @param resolvers Type resolvers
     */
    createEmptyTypedObj<TItem extends ContentItem>(type: string, resolvers: TypeResolver[]): TItem {
        if (!type) {
            throw Error('Cannot resolve type because no type name was provided');
        }

        const typeResolver = resolvers.find(m => m.type === type);

        if (!typeResolver) {
            throw Error(`Cannot find resolver for type '${type}'. This error means that no class was registered as TypeResolver for this type. Caller of this method should first check if type is available.`);
        }

        return typeResolver.resolve() as TItem;
    }
}

export const stronglyTypedResolver = new StronglyTypedResolver();
