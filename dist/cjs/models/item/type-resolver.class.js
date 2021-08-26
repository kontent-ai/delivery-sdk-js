"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeResolver = void 0;
class TypeResolver {
    /**
    * Resolver used to create instance of particular class representing your content item. This is useful if you want to access
    * properties in a strongly types manner when using TypeScript or to define additional properties/functions on the class.
    * For example if you create a class 'Character' which corresponds to 'character' code name of Kentico Kontent type, you
    * typically register it like: 'new TypeResolver("code_example", () => new CodeExample())'
    * @constructor
    * @param {string} type - Codename of the content item defined in your Kentico Kontent content types
    * @param {(data?: ITypeResolverData) => IContentItem} resolve - Function used create new instance of your class
    */
    constructor(type, resolve) {
        this.type = type;
        this.resolve = resolve;
    }
}
exports.TypeResolver = TypeResolver;
//# sourceMappingURL=type-resolver.class.js.map