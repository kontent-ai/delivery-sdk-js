import { Contracts } from '../contracts';
import { IQueryConfig } from './common/common-models';
import { ElementModels } from '../elements/element-models';

export interface IMapElementsResult<TContentItem extends IContentItem = IContentItem> {
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
    lastModified: string;

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
    workflowStep: string | null;
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

export interface IContentItem<TElements extends IContentItemElements = IContentItemElements> {
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
    item: IContentItem;
    rawItem: Contracts.IContentItemContract;
}

export interface IContentItemWithRawDataContainer {
    [key: string]: IContentItemWithRawElements;
}

export interface IContentItemsContainer {
    [key: string]: IContentItem;
}

export interface IRichTextImage {
    imageId: string;
    url: string;
    description: string | null;
    width: number | null;
    height: number | null;
}

export interface IItemQueryConfig extends IQueryConfig {}

export type PropertyNameResolver = (contentTypeCodename: string, elementCodename: string) => string;
