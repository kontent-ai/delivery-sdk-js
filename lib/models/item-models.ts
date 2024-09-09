import { Contracts } from '../contracts';
import { ElementModels } from '../elements/element-models';
import { IQueryConfig } from './common/common-models';

export interface IMapElementsResult<TContentItem extends IContentItem = IContentItem> {
    item: TContentItem;
    processedItems: IContentItemsContainer;
    preparedItems: IContentItemWithRawDataContainer;
    processingStartedForCodenames: string[];
}

export interface IContentItemSystemAttributes<
    TTypeCodename extends string = string,
    TLanguageCodenames extends string = string,
    TCollectionCodenames extends string = string,
    TWorkflowCodenames extends string = string,
    TWorkflowStepCodenames extends string = string
> {
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
    type: TTypeCodename;

    /**
     * Date when the item was last modified
     */
    lastModified: string;

    /**
     * Codename of the language
     */
    language: TLanguageCodenames;

    /**
     * Array of sitemap locations (obsolete)
     */
    sitemapLocations: string[];

    /**
     * Codename of the collection this item belongs to
     */
    collection: TCollectionCodenames;

    /**
     * Workflow step of the item
     */
    workflowStep: TWorkflowStepCodenames | null;

    /**
     * Workflow of the item
     */
    workflow: TWorkflowCodenames | null;
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

export interface IContentItem<
    TElements extends IContentItemElements = IContentItemElements,
    TTypeCodename extends string = string,
    TLanguageCodenames extends string = string,
    TCollectionCodenames extends string = string,
    TWorkflowCodenames extends string = string,
    TWorkflowStepCodenames extends string = string
> {
    /**
     * Elements of the content item
     */
    elements: TElements;

    /**
     * System data of the content item
     */
    system: IContentItemSystemAttributes<
        TTypeCodename,
        TLanguageCodenames,
        TCollectionCodenames,
        TWorkflowCodenames,
        TWorkflowStepCodenames
    >;
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

export interface IItemFeedQueryConfig extends IQueryConfig {
    disableItemLinking?: boolean;
}
