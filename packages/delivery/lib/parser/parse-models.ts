import { IItemQueryConfig, ILinkResolverResult } from '../interfaces';
import { RichTextContentType } from '../enums';

export interface IRichTextHtmlParser {
    resolveRichTextField(html: string, replacement: IRichTextReplacements, config: IHtmlResolverConfig): IRichTextResolverResult;
}

export interface IRichTextHtmlParser {
    resolveRichTextField(html: string, replacement: IRichTextReplacements, config: IHtmlResolverConfig): IRichTextResolverResult;
}

export interface IFeaturedObjects {
    links: ILinkObject[];
    linkedItems: ILinkedItemContentObject[];
}

export interface IRichTextResolverResult extends IFeaturedObjects {
    resolvedHtml: string;
}

export interface IRichTextReplacements {
    getLinkedItemHtml: (itemCodename: string, itemType: RichTextContentType) => string;
    getLinkResult: (itemId: string, linkText: string) => string | undefined | ILinkResolverResult;
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




