import { IDeliveryClientConfig } from '../config';
import { ItemContracts } from '../data-contracts';
import { IContentItem, IContentItemsContainer, IItemQueryConfig, IMapElementsResult } from '../models';
import { IRichTextHtmlParser } from '../parser/parse-models';
export declare class ElementMapper {
    private readonly config;
    private readonly richTextHtmlParser;
    private readonly defaultLinkedItemWrapperTag;
    private readonly defaultLinkedItemWrapperClasses;
    constructor(config: IDeliveryClientConfig, richTextHtmlParser: IRichTextHtmlParser);
    /**
     * Maps all element in given content item and returns strongly typed content item based on the resolver specified
     * in DeliveryClientConfig
     */
    mapElements<TItem extends IContentItem>(data: {
        item: ItemContracts.IContentItemContract;
        queryConfig: IItemQueryConfig;
        processedItems: IContentItemsContainer;
        processingStartedForCodenames: string[];
        preparedItems: IContentItemsContainer;
    }): IMapElementsResult<TItem> | undefined;
    private mapElement;
    private mapRichTextElement;
    private mapDateTimeElement;
    private mapMultipleChoiceElement;
    private mapNumberElement;
    private mapTextElement;
    private mapAssetsElement;
    private mapTaxonomyElement;
    private mapUnknowElement;
    private mapCustomElement;
    private mapUrlSlugElement;
    private mapLinkedItemsElement;
    private getUrlSlugResolverForElement;
    private getOrSaveLinkedItemForElement;
    private mapRichTextLinks;
    private mapRichTextImages;
    private resolveElementMap;
    private getGlobalUrlSlugResolverForType;
    private getCollisionResolver;
    private collidesWithAnotherProperty;
}
