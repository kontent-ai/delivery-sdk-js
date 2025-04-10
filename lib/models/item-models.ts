import { Contracts } from '../contracts';
import { ElementModels } from '../elements/element-models';
import { IQueryConfig } from './common/common-models';

export interface IMapElementsResult<
    TContentItem extends IContentItem = IContentItem,
    TLinkedItemType extends IContentItem = IContentItem
> {
    item: TContentItem;
    processedItems: IContentItemsContainer<TLinkedItemType>;
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
export type ContentItemElementsIndexer<TElement extends ElementModels.IElement<any> = ElementModels.IElement<any>> =
    TElement;

export type ContentItemType = 'component' | 'linkedItem';

/**
 * Prefix with I to keep the name consistent and prevent releasing major version
 */
export type IContentItemElements<TElementCodenames extends string = string> = Record<
    TElementCodenames,
    ContentItemElementsIndexer
>;

export type Snippet<
    TElementCodenames extends string,
    TElements extends IContentItemElements<TElementCodenames>
> = TElements;

export interface IContentItem<
    TElements extends IContentItemElements<TTypeElementCodenames> = IContentItemElements,
    TTypeCodename extends string = string,
    TLanguageCodenames extends string = string,
    TCollectionCodenames extends string = string,
    TWorkflowCodenames extends string = string,
    TWorkflowStepCodenames extends string = string,
    TTypeElementCodenames extends string = string
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

export interface IContentItemsContainer<TContentItem extends IContentItem> {
    [key: string]: TContentItem | undefined;
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

export interface IUsedInItemRecord<TClientTypes extends ClientTypes> {
    readonly system: {
        readonly id: string;
        readonly name: string;
        readonly codename: string;
        readonly language: TClientTypes['languageCodenames'];
        readonly type: TClientTypes['contentTypeCodenames'];
        readonly collection: TClientTypes['collectionCodenames'];
        readonly workflow: TClientTypes['workflowCodenames'];
        readonly workflowStep: TClientTypes['worfklowStepCodenames'];
        readonly lastModified: string;
    };
}

export type ClientTypes = {
    readonly contentItemType: IContentItem;
    readonly contentTypeCodenames: string;
    readonly workflowCodenames: string;
    readonly worfklowStepCodenames: string;
    readonly collectionCodenames: string;
    readonly taxonomyCodenames: string;
    readonly languageCodenames: string;
    readonly elementCodenames: string;
};
