import { ItemContracts } from '../data-contracts';
import { ContentItemSystemAttributes, IContentItem, ItemResolver, ITypeResolverData } from '../models';
import { TypeResolver } from '../models/item/type-resolver.class';
export declare class DeliveryItemStronglyTypeResolver {
    createEmptyItemInstanceOfType<TItem extends IContentItem = IContentItem>(type: string, typeResolvers: TypeResolver[]): TItem;
    /**
     * Creates item instance using either TypeResolver (if registered) or returns ContentItem
     */
    createItemInstance<TItem extends IContentItem = IContentItem>(data: ITypeResolverData, typeResolvers: TypeResolver[], itemResolver?: ItemResolver): TItem;
    /**
     * Maps raw system response to strongly typed class
     * @param rawSystem Raw system response
     */
    mapSystemAttributes(rawSystem: ItemContracts.IContentItemSystemAttributesContract): ContentItemSystemAttributes;
    /**
     * Creates new instance of given type
     * @param resolver Type resolver
     * @param type Type of the content item
     */
    private createInstanceWithResolver;
    /**
     * Gets TypeResolver associated with given type (type = codename of Kentico Kontent content type)
     * @param type Kentico Kontent content type codename
     * @param resolvers Array of TypeResolver
     */
    private getTypeResolver;
    /**
     * Creates base ContentItem when content type does not have a strongly typed model
     */
    private createContentItem;
    /**
     * Maps default properties (system & elements)
     * @param item Mapped content item
     * @param rawItem Raw content item from response
     */
    private assignRequiredContentItemData;
}
export declare const stronglyTypedResolver: DeliveryItemStronglyTypeResolver;
