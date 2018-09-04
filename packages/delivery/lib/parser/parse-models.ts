import { IItemQueryConfig, ILinkResolverResult } from '../interfaces';

export interface IRichTextHtmlParser {
    resolveRichTextField(html: string, replacement: IRichTextReplacements, config: IHtmlResolverConfig): IRichTextResolverResult;
}

export interface IRichTextHtmlParser {
    resolveRichTextField(html: string, replacement: IRichTextReplacements, config: IHtmlResolverConfig): IRichTextResolverResult;
}

export interface IRichTextResolverResult extends IFeaturedObjects {
    resolvedHtml: string;
}

export interface IFeaturedObjects {
    links: ILinkObject[];
    modularContentItems: IModularContentObject[];
}

export interface IRichTextReplacements {
    getModularContentHtml: (itemCodename: string) => string;
    getLinkResult: (itemId: string) => string | undefined | ILinkResolverResult;
}

export interface IHtmlResolverConfig {
    enableAdvancedLogging: boolean;
    queryConfig: IItemQueryConfig;
    modularContentWrapperTag: string;
    modularContentWrapperClasses: string[];
}

export interface IModularContentObject {
    dataType: string;
    dataCodename: string;
}

export interface ILinkObject {
    dataItemId: string;
}




