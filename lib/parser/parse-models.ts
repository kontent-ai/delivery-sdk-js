import { IItemQueryConfig, IUrlSlugResolverResult, IRichTextImageResolverResult, RichTextItemDataType, ContentItemType } from '../models';

export interface IRichTextHtmlParser {
    resolveRichTextElement(contentItemCodename: string, html: string, elementName: string, replacement: IRichTextReplacements, config: IHtmlResolverConfig): IRichTextResolverResult;
}

export interface IFeaturedObjects {
    links: ILinkObject[];
    linkedItems: ILinkedItemContentObject[];
    images: IImageObject[];
}

export interface IRichTextResolverResult extends IFeaturedObjects {
    resolvedHtml: string;
}

export interface IRichTextReplacements {
    getLinkedItemHtml: (itemCodename: string, itemType: RichTextItemDataType) => string;
    getUrlSlugResult: (itemId: string, linkText: string) => IUrlSlugResolverResult;
    getImageResult: (linkedItemCodename: string, imageId: string, elementName: string) => IRichTextImageResolverResult;
}

export interface IHtmlResolverConfig {
    enableAdvancedLogging: boolean;
    queryConfig: IItemQueryConfig;
    linkedItemWrapperTag: string;
    linkedItemWrapperClasses: string[];
}

export interface ILinkedItemContentObject {
    dataType: string;
    dataCodename: string;
    itemType: ContentItemType;
}

export interface ILinkObject {
    dataItemId: string;
}

export interface IImageObject {
    imageId: string;
}




