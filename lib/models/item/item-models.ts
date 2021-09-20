import { ItemContracts } from '../../data-contracts/item-contracts';
import { IQueryConfig } from '../common/common-models';
import {
    ItemUrlSlugResolver,
    ItemPropertyResolver,
    ItemResolver,
    ItemRichTextResolver,
    RichTextImageResolver
} from './item-resolvers';
import { ElementModels } from '../../elements/element-models';
import { Elements } from '../../elements/elements';

export interface IMapElementsResult<TElements extends IContentItemElements> {
    item: IContentItem<TElements>;
    processedItems: IContentItemsContainer;
    preparedItems: IContentItemsContainer;
    processingStartedForCodenames: string[];
}

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
     * Array of sitemap locations (obsolete)
     */
    sitemapLocations: string[];

    /**
     * Codename of the collection this item belongs to
     */
    collection: string;

    /**
     * Workflow step of the item
     */
    workflowStep: string | 'published';
}

/**
 * Indexer for elements within content item
 */
export type ContentItemElementsIndexer = ElementModels.IElement<any>;

export type ContentItemType = 'component' | 'linkedItem';

export interface IContentItemElements {
    /**
     * Indexer
     */
    [key: string]: ContentItemElementsIndexer;
}

export interface IContentItem<TElements extends IContentItemElements> {

    /**
     * Elements of the content item
     */
    elements: TElements;

    /**
     * System data of the content item
     */
    system: IContentItemSystemAttributes;

    /**
     * Debug data of the item
     */
    _raw: ItemContracts.IContentItemContract;

    /**
     * Content item configuration
     */
    _config?: IContentItemConfig;

    /**
     * Gets array of all elements assigned to content item.
     * This is an alternative to accessing elements via properties.
     */
    getElements(): ElementModels.IElement<any>[];
}

export class ContentItem<TElements extends IContentItemElements> implements IContentItem<TElements> {
    /**
     * Elements of the content item
     */
    public elements!: TElements;

    /**
     * Content item system elements
     */
    public system!: ContentItemSystemAttributes;

    /**
     * Raw data
     */
    public _raw!: ItemContracts.IContentItemContract;

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

    /**
     * Gets array of all elements assigned to content item.
     * This is an alternative to accessing elements via properties.
     */
    getElements(): ElementModels.IElement<any>[] {
        const elements: ElementModels.IElement<any>[] = [];

        // get all props
        for (const key of Object.keys(this.elements)) {
            const prop = this.elements[key];

            if (prop instanceof Elements.BaseElement) {
                elements.push(prop);
            }
        }

        return elements;
    }
}

export class ContentItemSystemAttributes implements IContentItemSystemAttributes {
    /**
     * Id of the item
     */
    public id: string;

    /**
     * Name of the item
     */
    public name: string;

    /**
     * Codename of the item
     */
    public codename: string;

    /**
     * Codename of the type this item is using
     */
    public type: string;

    /**
     * Date when the item was last modified
     */
    public lastModified: Date;

    /**
     * Codename of the language
     */
    public language: string;

    /**
     * Array of sitemap locations
     */
    public sitemapLocations: string[];

    /**
     * Codename of the collection this item belongs to
     */
    public collection: string;

    /**
     *  Workflow step of the item
     */
    public workflowStep: string | 'published';

    constructor(data: {
        id: string;
        name: string;
        codename: string;
        type: string;
        lastModified: Date;
        language: string;
        sitemapLocations: string[];
        collection: string;
        workflowStep: string;
    }) {
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.codename = data.codename;
        this.lastModified = data.lastModified;
        this.language = data.language;
        this.sitemapLocations = data.sitemapLocations;
        this.collection = data.collection;
        this.workflowStep = data.workflowStep;
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

    constructor(data: { linkId: string; codename: string; type: string; urlSlug: string }) {
        Object.assign(this, data);
    }
}

export interface IContentItemsContainer {
    [key: string]: IContentItem<any>;
}

export class RichTextImage {
    public imageId!: string;
    public url!: string;
    public description?: string;
    public width?: number;
    public height?: number;

    constructor(data: { imageId: string; url: string; description?: string; height?: number; width?: number }) {
        Object.assign(this, data);
    }
}

export interface ITypeResolverData {
    item: ItemContracts.IContentItemContract;
}

export interface IItemQueryConfig extends IQueryConfig {
    throwErrorForMissingLinkedItems?: boolean;
    urlSlugResolver?: ItemUrlSlugResolver;
    richTextResolver?: ItemRichTextResolver;
    itemResolver?: ItemResolver;
    richTextImageResolver?: RichTextImageResolver;
}

export interface IUrlSlugResolverContext {
    /**
     * Original link text (available only for links in rich text element)
     */
    linkText?: string;

    /**
     * Content item if available
     */
    item?: IContentItem<any>;

    /**
     * Link id (equal to `contentItem` id). Available only for links inside `richTextElement`
     */
    linkId?: string;
}

export interface IUrlSlugResolverResult {
    html?: string;
    url?: string;
}

export interface IRichTextResolverContext {
    contentType: RichTextItemDataType;
}

export interface IRichTextImageResolverResult {
    url: string;
}

export enum RichTextItemDataType {
    Item = 'item'
}

export interface IContentItemConfig {
    /**
     * Function used to bind elements returned from Kentico Kontent to a model property.
     * Common use is to bind e.g. 'FirstName' element from Kentico Kontent response to 'firstName' element in model
     */
    propertyResolver?: ItemPropertyResolver;

    /**
     *  Function used to resolve url slug elements
     */
    urlSlugResolver?: ItemUrlSlugResolver;

    /**
     * Function used to resolve linked items in rich text elements to HTML
     */
    richTextResolver?: ItemRichTextResolver;
}
