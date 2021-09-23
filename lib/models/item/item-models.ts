import { ItemContracts } from '../../data-contracts/item-contracts';
import { IQueryConfig } from '../common/common-models';
import { ItemUrlSlugResolver, ItemRichTextResolver, RichTextImageResolver } from './item-resolvers';
import { ElementModels } from '../../elements/element-models';

export interface IMapElementsResult<TContentItem extends IContentItem<any> = IContentItem<any>> {
    item: TContentItem;
    processedItems: IContentItemsContainer;
    preparedItems: IContentItemWithRawDataContainer;
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
    workflowStep: string;
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
}

export interface ILink {
    /**
     * Id of the link
     */
    linkId: string;

    /**
     * Codename of the content item
     */
    codename: string;

    /**
     * Type codename of the content item
     */
    type: string;

    /**
     * Url slug defined for the content item
     */
    urlSlug: string;
}

export interface IContentItemWithRawElements {
    item: IContentItem<any>;
    rawItem: ItemContracts.IContentItemContract;
}

export interface IContentItemWithRawDataContainer {
    [key: string]: IContentItemWithRawElements;
}

export interface IContentItemsContainer {
    [key: string]: IContentItem<any>;
}

export interface IRichTextImage {
    imageId: string;
    url: string;
    description?: string;
    width?: number;
    height?: number;
}

export interface ITypeResolverData {
    item: ItemContracts.IContentItemContract;
}

export interface IItemQueryConfig extends IQueryConfig {
    throwErrorForMissingLinkedItems?: boolean;
    urlSlugResolver?: ItemUrlSlugResolver;
    richTextResolver?: ItemRichTextResolver;
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
