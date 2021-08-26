"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stronglyTypedResolver = exports.DeliveryItemStronglyTypeResolver = void 0;
const models_1 = require("../models");
class DeliveryItemStronglyTypeResolver {
    createEmptyItemInstanceOfType(type, typeResolvers) {
        const resolver = this.getTypeResolver(type, typeResolvers);
        if (!resolver) {
            return this.createContentItem(undefined);
        }
        return this.createInstanceWithResolver(resolver, undefined);
    }
    /**
     * Creates item instance using either TypeResolver (if registered) or returns ContentItem
     */
    createItemInstance(data, typeResolvers, itemResolver) {
        let itemInstance;
        if (itemResolver) {
            itemInstance = itemResolver(data.item);
        }
        if (!itemInstance) {
            const typeResolver = this.getTypeResolver(data.item.system.type, typeResolvers);
            if (typeResolver) {
                // type resolver is registered, create new instance of given type
                itemInstance = this.createInstanceWithResolver(typeResolver, data);
            }
            else {
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
    mapSystemAttributes(rawSystem) {
        return new models_1.ContentItemSystemAttributes({
            name: rawSystem.name,
            codename: rawSystem.codename,
            id: rawSystem.id,
            lastModified: new Date(rawSystem.last_modified),
            language: rawSystem.language,
            type: rawSystem.type,
            sitemapLocations: rawSystem.sitemap_locations,
            collection: rawSystem.collection
        });
    }
    /**
     * Creates new instance of given type
     * @param resolver Type resolver
     * @param type Type of the content item
     */
    createInstanceWithResolver(resolver, data) {
        return resolver.resolve(data);
    }
    /**
     * Gets TypeResolver associated with given type (type = codename of Kentico Kontent content type)
     * @param type Kentico Kontent content type codename
     * @param resolvers Array of TypeResolver
     */
    getTypeResolver(type, resolvers) {
        return resolvers.find(m => m.type.toLowerCase() === type.toLowerCase());
    }
    /**
     * Creates base ContentItem when content type does not have a strongly typed model
     */
    createContentItem(item) {
        const contentItem = new models_1.ContentItem();
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
    assignRequiredContentItemData(item, rawItem) {
        item.system = this.mapSystemAttributes(rawItem.system);
        item._raw = rawItem;
    }
}
exports.DeliveryItemStronglyTypeResolver = DeliveryItemStronglyTypeResolver;
exports.stronglyTypedResolver = new DeliveryItemStronglyTypeResolver();
//# sourceMappingURL=delivery-item-strongly-type.resolver.js.map