import { IContentItem } from '../../interfaces/item/icontent-item.interface';

export class TypeResolver {

    /**
    * Resolver used to create empty instance of object representing your content item.
    * For example if you create a class 'Character' which corresponds to 'character' code name of Kentico Cloud type, you
    * need to use TypeResolver like: 'new TypeResolver("code_example", () => new CodeExample())'
    * @constructor
    * @param {string} type - Codename of the content item defined in your Kentico Cloud content types
    * @param {() => IContentItem} resolve - Calbacked used to returs empty instance of proper item class
    */
    constructor(
        public type: string,
        public resolve: () => IContentItem
    ) { }
}
