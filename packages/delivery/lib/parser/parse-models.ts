import { RichTextContentType } from '../enums';
import { IItemQueryConfig, ILinkResolverResult, IRichTextImageResolverResult } from '../interfaces';

export type ResolverContext = 'root' | 'nested';

export interface IRichTextHtmlParser {
    resolveRichTextElement(resolverContext: ResolverContext, contentItemCodename: string, html: string, elementName: string, replacement: IRichTextReplacements, config: IHtmlResolverConfig): IRichTextResolverResult;
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
    getLinkedItemHtml: (itemCodename: string, itemType: RichTextContentType) => string;
    getLinkResult: (itemId: string, linkText: string) => string | undefined | ILinkResolverResult;
    getImageResult: (resolverCotnext: ResolverContext, linkedItemCodename: string, imageId: string, elementName: string) => IRichTextImageResolverResult;
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
}

export interface ILinkObject {
    dataItemId: string;
}

export interface IImageObject {
    imageId: string;
}




