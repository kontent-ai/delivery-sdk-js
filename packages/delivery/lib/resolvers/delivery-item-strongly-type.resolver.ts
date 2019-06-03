import { ItemContracts } from '../data-contracts';
import { IContentItem } from '../interfaces';
import { ContentItemSystemAttributes } from '../models/item/content-item-system-attributes';
import { ContentItem } from '../models/item/content-item.class';
import { TypeResolver } from '../models/item/type-resolver.class';

export class DeliveryItemStronglyTypeResolver {

    private readonly systemFieldName = 'system';
    private readonly elementsFieldName = 'elements';

    createDummyInstance<TItem extends IContentItem = IContentItem>(type: string, typeResolvers: TypeResolver[]): TItem | undefined {
        const typeResolver = this.getTypeResolver(type, typeResolvers);
        if (typeResolver) {
            // type resolver is registered, create new instance of given type
            return stronglyTypedResolver.createInstanceWithResolver<TItem>(typeResolver);
        }

        return undefined;
    }

    /**
     * Creates item instance using either TypeResolver (if registered) or returns ContentItem
     */
    createItemInstance<TItem extends IContentItem = IContentItem>(type: string, item: ItemContracts.IContentItemContract, typeResolvers: TypeResolver[]): TItem {
        const typeResolver = this.getTypeResolver(type, typeResolvers);
        let itemInstance: TItem | undefined;
        if (typeResolver) {
            // type resolver is registered, create new instance of given type
            itemInstance = stronglyTypedResolver.createInstanceWithResolver<TItem>(typeResolver);
        } else {
            // not type resolver is register for this type, use ContentItem
            itemInstance = stronglyTypedResolver.createContentItem(item) as TItem;
        }

        if (!itemInstance) {
            throw Error(`Item with codename '${item.system.codename}' could not be instantiated`);
        }

        this.assignDefaultProperties(itemInstance, item);
        return itemInstance;
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
     * Creates new instance of given type
     * @param type Type of the content item
     * @param resolvers Type resolvers
     */
    private createInstanceWithResolver<TItem extends IContentItem>(resolver: TypeResolver): TItem {
        return resolver.resolve() as TItem;
    }

    /**
     * Gets TypeResolver associated with given type (type = codename of Kentico Cloud content type)
     * @param type Kentico Cloud content type codename
     * @param resolvers Array of TypeResolver
     */
    private getTypeResolver(type: string, resolvers: TypeResolver[]): TypeResolver | undefined {
        return resolvers.find(m => m.type.toLowerCase() === type.toLowerCase());
    }

    /**
     * Creates base ContentItem when content type does not have a strongly typed model
     */
    private createContentItem(item: ItemContracts.IContentItemContract): IContentItem {
        const contentItem = new ContentItem();
        this.assignDefaultProperties(contentItem, item);
        return contentItem;
    }

    /**
     * Maps default properties (system & elements)
     * @param item Mapped content item
     * @param rawItem Raw content item from response
     */
    private assignDefaultProperties(item: IContentItem, rawItem: ItemContracts.IContentItemContract): void {
        item.system = this.mapSystemAttributes(rawItem[this.systemFieldName]);
        item.elements = rawItem[this.elementsFieldName];
    }

}

export const stronglyTypedResolver = new DeliveryItemStronglyTypeResolver();
