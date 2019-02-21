import { IRichTextResolverContext } from '../..//interfaces/item/irich-text-resolver-context';
import { ItemContracts } from '../../data-contracts/item-contracts';
import { FieldContracts } from '../../fields/field-contracts';
import { IItemQueryConfig } from '../../interfaces/item/iitem-query.config';
import { ILinkResolverContext } from '../../interfaces/item/ilink-resolver-context';
import { ILinkResolverResult } from '../../interfaces/item/ilink-resolver-result';
import { IRichTextImageResolverResult } from '../../interfaces/item/irich-text-resolver-result';
import { ContentItem } from './content-item.class';
import { RichTextImage } from './image.class';
import { Link } from './link.class';

export class TypeResolver {

    /**
    * Resolver used to create empty instance of object representing your content item.
    * For example if you create a class 'Character' which corresponds to 'character' code name of Kentico Cloud type, you
    * need to use TypeResolver like: 'new TypeResolver("code_example", () => new CodeExample())'
    * @constructor
    * @param {string} type - Codename of the content item defined in your Kentico Cloud content types
    * @param {() => ContentItem} resolve - Calbacked used to returs empty instance of proper item class
    */
    constructor(
        public type: string,
        public resolve: () => ContentItem
    ) { }
}

export type ItemFieldCollisionResolver = (fieldName: string) => string;
export type ItemPropertyResolver = (fieldName: string) => string;
export type ItemLinkResolver = (link: Link, context: ILinkResolverContext) => string | ILinkResolverResult;
export type ItemRichTextResolver = (contentItem: ContentItem, context: IRichTextResolverContext) => string;
export type ItemResolver = (field: FieldContracts.IFieldContract, rawItem: ItemContracts.IContentItemContract, modularContent: any, queryConfig: IItemQueryConfig, ) => ContentItem | undefined;
export type RichTextImageResolver = (image: RichTextImage, fieldName: string) => IRichTextImageResolverResult;
