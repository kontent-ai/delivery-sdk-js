import { ItemContracts } from '../data-contracts';
import { ContentItemSystemAttributes } from '../models/item/content-item-system-attributes';
import { ContentItem } from '../models/item/content-item.class';
import { TypeResolver } from '../models/item/item-resolvers';

export class DeliveryItemStronglyTypeResolver {

    private readonly systemFieldName = 'system';
    private readonly elementsFieldName = 'elements';

    /**
     * Indicates if given type has a type resolver
     * @param type Type
     * @param resolvers Type resolvers
     */
    hasTypeResolver(type: string, resolvers: TypeResolver[]): boolean {
        return !(!resolvers.find(m => m.type === type));
    }

    /**
     * Creates base ContentItem when content type does not have a strongly typed model
     */
    createContentItem(item: ItemContracts.IContentItemContract): ContentItem {
        const contentItem = new ContentItem();
        this.assignDefaultProperties(contentItem, item);
        return contentItem;
    }

    /**
     * Takes given type name and creates a strongly typed model based specified in client configuration
     */
    createTypedObj<TItem extends ContentItem>(type: string, item: ItemContracts.IContentItemContract, typeResolvers: TypeResolver[]): TItem {
        const typedItem = this.createEmptyTypedObj<TItem>(type, typeResolvers);

        if (!typedItem) {
            throw Error(`Cannot find resolver for type '${type}'. This error means that no class was registered as TypeResolver`);
        }

        this.assignDefaultProperties(typedItem, item);
        return typedItem;
    }

    /**
     * Creates empty typed object of given type
     * @param type Type of the content item
     * @param resolvers Type resolvers
     */
    createEmptyTypedObj<TItem extends ContentItem>(type: string, resolvers: TypeResolver[]): TItem | undefined {
        if (!type) {
            throw Error('Cannot resolve type because no type name was provided');
        }

        const typeResolver = resolvers.find(m => m.type === type);

        if (!typeResolver) {
            return undefined;
        }

        return typeResolver.resolve() as TItem;
    }

    /**
     * Maps raw system response to strongly typed class
     * @param rawSystem Raw system response
     */
    mapSystemAttributes(rawSystem: ItemContracts.IContentItemSystemAttributesContract): ContentItemSystemAttributes {
        return new ContentItemSystemAttributes({
            name: rawSystem.name,
            codename: rawSystem.codename,
            id: rawSystem.id,
            lastModified: new Date(rawSystem.last_modified),
            language: rawSystem.language,
            type: rawSystem.type,
            sitemapLocations: rawSystem.sitemap_locations
        });
    }

    /**
     * Maps default properties (system & elements)
     * @param item Mapped content item
     * @param rawItem Raw content item from response
     */
    private assignDefaultProperties(item: ContentItem, rawItem: ItemContracts.IContentItemContract): void {
        item.system = this.mapSystemAttributes(rawItem[this.systemFieldName]);
        item.elements = rawItem[this.elementsFieldName];
    }

}

export const stronglyTypedResolver = new DeliveryItemStronglyTypeResolver();
