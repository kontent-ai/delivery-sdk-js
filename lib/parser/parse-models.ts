import { IItemQueryConfig } from '../interfaces';

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
    getLinkUrl: (itemId: string) => string;
}

export interface IHtmlResolverConfig {
    enableAdvancedLogging: boolean;
    queryConfig: IItemQueryConfig;
}

export interface IModularContentObject {
    dataType: string;
    dataCodename: string;
}

export interface ILinkObject {
    dataItemId: string;
}




