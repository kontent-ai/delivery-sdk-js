import { ItemContracts } from '../data-contracts';
import { ContentItem, ContentItemSystemAttributes, IContentItem, IContentItemElements, ItemResolver, ITypeResolverData } from '../models';
import { TypeResolver } from '../models/item/type-resolver.class';

export class DeliveryItemStronglyTypeResolver {
    createEmptyItemInstanceOfType<TElements extends IContentItemElements>(
        type: string,
        typeResolvers: TypeResolver[]
    ): IContentItem<TElements> {
        const resolver = this.getTypeResolver(type, typeResolvers);
        if (!resolver) {
            return this.createContentItem(undefined);
        }
        return this.createInstanceWithResolver<TElements>(resolver, undefined);
    }

    /**
     * Creates item instance using either TypeResolver (if registered) or returns ContentItem
     */
    createItemInstance<TElements extends IContentItemElements>(
        data: ITypeResolverData,
        typeResolvers: TypeResolver[],
        itemResolver?: ItemResolver
    ): IContentItem<TElements>  {
        let itemInstance: IContentItem<TElements> | undefined;

        if (itemResolver) {
            itemInstance = itemResolver(data.item);
        }

        if (!itemInstance) {
            const typeResolver = this.getTypeResolver(data.item.system.type, typeResolvers);
            if (typeResolver) {
                // type resolver is registered, create new instance of given type
                itemInstance = this.createInstanceWithResolver<TElements>(typeResolver, data);
            } else {
                // not type resolver is register for this type, use ContentItem
                itemInstance = this.createContentItem(data.item);
            }
        }

        if (!itemInstance) {
            throw Error(`Item with codename '${data.item.system.codename}' could not be instantiated`);
        }

        this.assignRequiredContentItemData(itemInstance, data.item);
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
            sitemapLocations: rawSystem.sitemap_locations,
            collection: rawSystem.collection,
            workflowStep: rawSystem.workflow_step
        });
    }

    /**
     * Creates new instance of given type
     * @param resolver Type resolver
     * @param type Type of the content item
     */
    private createInstanceWithResolver<TElements extends IContentItemElements>(
        resolver: TypeResolver,
        data?: ITypeResolverData
    ): IContentItem<TElements> {
        return resolver.resolve(data);
    }

    /**
     * Gets TypeResolver associated with given type (type = codename of Kentico Kontent content type)
     * @param type Kentico Kontent content type codename
     * @param resolvers Array of TypeResolver
     */
    private getTypeResolver(type: string, resolvers: TypeResolver[]): TypeResolver | undefined {
        return resolvers.find((m) => m.type.toLowerCase() === type.toLowerCase());
    }

    /**
     * Creates base ContentItem when content type does not have a strongly typed model
     */
    private createContentItem(item?: ItemContracts.IContentItemContract): IContentItem<any> {
        const contentItem = new ContentItem();
        if (item) {
            this.assignRequiredContentItemData(contentItem, item);
        }
        return contentItem;
    }

    /**
     * Maps default properties (system & elements)
     * @param item Mapped content item
     * @param rawItem Raw content item from response
     */
    private assignRequiredContentItemData(item: IContentItem<any>, rawItem: ItemContracts.IContentItemContract): void {
        item.system = this.mapSystemAttributes(rawItem.system);
        item.elements = {};
        item._raw = rawItem;
    }
}

export const stronglyTypedResolver = new DeliveryItemStronglyTypeResolver();
