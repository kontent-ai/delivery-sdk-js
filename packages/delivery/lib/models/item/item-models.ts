import { ItemContracts } from '../../data-contracts/item-contracts';
import { IQueryConfig } from '../common/common-models';
import {
    ItemLinkResolver,
    ItemPropertyResolver,
    ItemResolver,
    ItemRichTextResolver,
    RichTextImageResolver,
} from './item-resolvers';


export interface IContentItemSystemAttributes {
    /**
   * Id of the item
   */
    id: string;

    /**
     * Name of the item
     */
    name: string;

    /**
     * Codename of the item
     */
    codename: string;

    /**
     * Codename of the type this item is using
     */
    type: string;

    /**
     * Date when the item was last modified
     */
    lastModified: Date;

    /**
     * Codename of the language
     */
    language: string;

    /**
     * Array of sitemap locatoins
     */
    sitemapLocations: string[];
}

/**
 * Indexer is defined as 'any' because models can contain custom methods, different field types, linked items ...
 */
export type ContentItemIndexer = any;

export interface IContentItem {

    /**
    * Indexer
    */
    [key: string]: ContentItemIndexer;

    /**
     * Content item system elements
     */
    system: IContentItemSystemAttributes;

    /**
     * Debug data of the item
     */
    _debug: IContentItemDebugData;

    /**
     * Content item configuration
     */
    _config?: IContentItemConfig;
}

export class ContentItem implements IContentItem {

    /**
     * Indexer
     */
    [key: string]: ContentItemIndexer;

    /**
     * Content item system elements
     */
    public system!: ContentItemSystemAttributes;

    /**
     * Debug data of the item
     */
    public _debug!: IContentItemDebugData;

    /**
     * configuration
     */
    public _config?: IContentItemConfig;

    /**
    * Base class representing content item type. All content type models need to extend this class.
    * @constructor
    */
    constructor(config?: IContentItemConfig) {
        this._config = config;
    }
}

export class ContentItemSystemAttributes implements IContentItemSystemAttributes {

    /**
    * Id of the item
    */
    public id!: string;

    /**
     * Name of the item
     */
    public name!: string;

    /**
     * Codename of the item
     */
    public codename!: string;

    /**
     * Codename of the type this item is using
     */
    public type!: string;

    /**
     * Date when the item was last modified
     */
    public lastModified!: Date;

    /**
     * Codename of the language
     */
    public language!: string;

    /**
     * Array of sitemap locatoins
     */
    public sitemapLocations!: string[];

    constructor(
        data: {
            id: string,
            name: string,
            codename: string,
            type: string,
            lastModified: Date,
            language: string,
            sitemapLocations: string[]
        }
    ) {
        Object.assign(this, data);
    }
}

export class Link {

    /**
     * Id of the link
     */
    public linkId!: string;

    /**
     * Codename of the content item
     */
    public codename!: string;

    /**
     * Type codename of the content item
     */
    public type!: string;

    /**
     * Url slug defined for the content item
     */
    public urlSlug!: string;

    constructor(
        data: {
            linkId: string;
            codename: string,
            type: string,
            urlSlug: string,
        }
    ) {
        Object.assign(this, data);
    }
}

export interface IContentItemsContainer<TItem extends IContentItem = IContentItem> {
    [key: string]: TItem;
}

export class RichTextImage {

    public imageId!: string;
    public url!: string;
    public description?: string;
    public width?: number;
    public height?: number;

    constructor(
        data: {
            imageId: string,
            url: string,
            description?: string,
            height?: number;
            width?: number;
        }
    ) {
        Object.assign(this, data);
    }
}

export interface IContentItemDebugData {
    rawElements: ItemContracts.IContentItemElementsContracts;
}

export interface ITypeResolverData {
    item: ItemContracts.IContentItemContract;
    modularContent: ItemContracts.IModularContentWrapperContract;
}

export interface IItemQueryConfig extends IQueryConfig {
    throwErrorForMissingLinkedItems?: boolean;
    linkResolver?: ItemLinkResolver;
    richTextResolver?: ItemRichTextResolver<IContentItem>;
    itemResolver?: ItemResolver;
    richTextImageResolver?: RichTextImageResolver;
}

export interface ILinkResolverContext {

    /**
     * Original link text (available only for links in rich text element)
     */
    linkText?: string;
}

export interface ILinkResolverResult {
    asHtml?: string;
    asUrl?: string;
}

export interface IRichTextResolverContext {
    contentType: RichTextContentType;
}

export interface IRichTextImageResolverResult {
    url: string;
}

export enum RichTextContentType {
    Item = 'item',
}

export interface IContentItemConfig {
    /**
    * Function used to bind elements returned from Kentico Cloud to a model property.
    * Common use is to bind e.g. 'FirstName' element from Kentico Cloud response to 'firstName' element in model
    */
    propertyResolver?: ItemPropertyResolver;

    /**
     *  Function used to resolve links or URL slug elements
     */
    linkResolver?: ItemLinkResolver;

    /**
     * Function used to resolve linked items in rich text elements to HTML
     */
    richTextResolver?: ItemRichTextResolver<any>;
}
