import { Elements } from '../elements';
import { IContentItem, ILink, IRichTextImage, IContentItemElements } from '../models';

export interface IResolvedRichTextElement {
    html: string;
    linkedItemCodenames: string[];
    componentCodenames: string[];
}

export interface IRichTextUrlResult {
    linkHtml?: string;
    linkUrl?: string;
}

export interface IRichTextImageResult {
    imageUrl?: string;
    imageHtml?: string;
}

export interface IRichTextContentItemResult {
    contentItemHtml?: string;
}

export type IRichTextUrlResolver = (link: IRichTextLinkInput) => IRichTextUrlResult;
export type IRichTextImageResolver = (image?: IRichTextImage) => IRichTextImageResult;
export type IRichTextContentItemResolver = (contentItem?: IContentItem) => IRichTextContentItemResult;

export interface IRichTextResolverInput {
    element: Elements.IRichTextElement;
    urlResolver?: IRichTextUrlResolver;
    imageResolver?: IRichTextImageResolver;
    contentItemResolver?: IRichTextContentItemResolver;
    linkedItems?: IContentItem<IContentItemElements>[];
}

export interface IRichTextLinkInput {
    linkText?: string;
    link?: ILink;
}

export interface IRichTextResolver {
    resolveRichText(input: IRichTextResolverInput): IResolvedRichTextElement;
}
