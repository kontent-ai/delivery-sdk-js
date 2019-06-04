import { IContentItem, ITypeResolverData } from '../../interfaces';

export class TypeResolver {

    /**
    * Resolver used to create instance of particular class representing your content item. This is useful if you want to access
    * properties in a strongly types manner when using TypeScript or to define additional properties/functions on the class.
    * For example if you create a class 'Character' which corresponds to 'character' code name of Kentico Cloud type, you
    * typically register it like: 'new TypeResolver("code_example", () => new CodeExample())'
    * @constructor
    * @param {string} type - Codename of the content item defined in your Kentico Cloud content types
    * @param {(data: ITypeResolverData) => IContentItem} resolve - Function used create new instance of your class
    */
    constructor(
        public type: string,
        public resolve: (data: ITypeResolverData) => IContentItem
    ) { }
}