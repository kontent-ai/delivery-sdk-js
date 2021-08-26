import { IDeliveryClientConfig } from '../config';
import { ItemContracts } from '../data-contracts';
import { IContentItem, IContentItemsContainer, IItemQueryConfig } from '../models';
import { IRichTextHtmlParser } from '../parser';
export interface IMapItemResult<TItem extends IContentItem = IContentItem> {
    item: TItem;
    processedItems: IContentItemsContainer;
    preparedItems: IContentItemsContainer;
    processingStartedForCodenames: string[];
}
export interface IMultipleItemsMapResult<TItem extends IContentItem = IContentItem> {
    items: TItem[];
    linkedItems: IContentItemsContainer;
}
export interface ISingleItemMapResult<TItem extends IContentItem = IContentItem> {
    item: TItem;
    linkedItems: IContentItemsContainer;
}
export declare class ItemMapper {
    readonly config: IDeliveryClientConfig;
    readonly richTextHtmlParser: IRichTextHtmlParser;
    private readonly elementMapper;
    constructor(config: IDeliveryClientConfig, richTextHtmlParser: IRichTextHtmlParser);
    /**
     * Maps single item to its proper strongly typed model from the given Kontent response
     * @param response Kontent response used to map the item
     * @param queryConfig Query configuration
     */
    mapSingleItemFromResponse<TItem extends IContentItem = IContentItem>(response: ItemContracts.IViewContentItemContract, queryConfig: IItemQueryConfig): ISingleItemMapResult<TItem>;
    /**
     * Maps multiple items to their strongly typed model from the given Kontent response
     * @param response Kontent response used to map the item
     * @param queryConfig Query configuration
     */
    mapMultipleItemsFromResponse<TItem extends IContentItem = IContentItem>(response: ItemContracts.IItemsWithModularContentContract, queryConfig: IItemQueryConfig): IMultipleItemsMapResult<TItem>;
    /**
     * Maps item contracts to full models
     */
    mapItems<TItem extends IContentItem = IContentItem>(data: {
        mainItems: ItemContracts.IContentItemContract[];
        linkedItems: ItemContracts.IContentItemContract[];
        queryConfig: IItemQueryConfig;
    }): IMultipleItemsMapResult<TItem>;
    /**
     * Maps item contract to full model
     */
    private mapItem;
}
