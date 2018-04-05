import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';

export interface IRichTextHtmlParser {
    resolveRichTextField(html: string, replacement: IRichTextReplacements, config: IHtmlResolverConfig): IRichTextResolverResult;
}

export interface IModularContentObject {
    node: Node;
    dataType: string;
    dataCodename: string;
}

export interface ILinkObject {
    node: Node;
    dataItemId: string;
}

export interface IFeaturedObjects {
    links: ILinkObject[];
    modularContentItems: IModularContentObject[];
}

export interface IRichTextReplacements {
    getModularContentHtml: (itemCodename: string) => string;
    getLinkUrl: (itemId: string) => string;
}

export interface IRichTextResolverResult extends IFeaturedObjects {
    resolvedHtml: string;
}

export interface IHtmlResolverConfig {
    enableAdvancedLogging: boolean;
    queryConfig: IItemQueryConfig;
}
