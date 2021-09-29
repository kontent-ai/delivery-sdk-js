import { Elements } from '../elements';
import { IContentItem, ILink, IRichTextImage } from '../models';

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

export type IRichTextUrlAsyncResolver = (link: IRichTextLinkInput) => Promise<IRichTextUrlResult>;
export type IRichTextImageAsyncResolver = (image?: IRichTextImage) => Promise<IRichTextImageResult>;
export type IRichTextContentItemAsyncResolver = (contentItem?: IContentItem) => Promise<IRichTextContentItemResult>;

export interface IRichTextResolverInput {
    element: Elements.RichTextElement;
    urlResolver?: IRichTextUrlResolver;
    imageResolver?: IRichTextImageResolver;
    contentItemResolver?: IRichTextContentItemResolver;
    linkedItems?: IContentItem[];
}

export interface IRichTextResolverAsyncInput {
    element: Elements.RichTextElement;
    urlResolver?: IRichTextUrlAsyncResolver;
    imageResolver?: IRichTextImageAsyncResolver;
    contentItemResolver?: IRichTextContentItemAsyncResolver;
    linkedItems?: IContentItem[];
}

export interface IRichTextLinkInput {
    linkText?: string;
    link?: ILink;
}

export interface IRichTextResolver {
    resolveRichText(input: IRichTextResolverInput): IResolvedRichTextElement;
}

export interface IRichTextAsyncResolver {
    resolveRichTextAsync(input: IRichTextResolverAsyncInput): Promise<IResolvedRichTextElement>;
}
