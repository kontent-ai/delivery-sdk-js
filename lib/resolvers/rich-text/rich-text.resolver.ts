import { Elements } from '../../elements';
import { IContentItem, ILink, IRichTextImage } from '../../models';

export interface IResolvedRichTextHtmlResult {
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

export type IRichTextUrlResolver = (linkId: string, linkText: string, link?: ILink) => IRichTextUrlResult;
export type IRichTextImageResolver = (imageId: string, image?: IRichTextImage) => IRichTextImageResult;
export type IRichTextContentItemResolver = (
    itemCodename: string,
    contentItem?: IContentItem
) => IRichTextContentItemResult;

export type IRichTextUrlResolverAsync = (linkId: string, linkText: string, link?: ILink) => Promise<IRichTextUrlResult>;
export type IRichTextImageResolverAsync = (imageId: string, image?: IRichTextImage) => Promise<IRichTextImageResult>;
export type IRichTextContentItemResolverAsync = (
    itemCodename: string,
    contentItem?: IContentItem
) => Promise<IRichTextContentItemResult>;

export interface IRichTextHtmlResolverInput {
    element: Elements.RichTextElement;
    urlResolver?: IRichTextUrlResolver;
    imageResolver?: IRichTextImageResolver;
    contentItemResolver?: IRichTextContentItemResolver;
    linkedItems?: IContentItem[];
}

export interface IRichTextHtmlResolverInputAsync {
    element: Elements.RichTextElement;
    urlResolverAsync?: IRichTextUrlResolverAsync;
    imageResolverAsync?: IRichTextImageResolverAsync;
    contentItemResolverAsync?: IRichTextContentItemResolverAsync;
    linkedItems?: IContentItem[];
}

export interface IRichTextResolver<TInput, TResult> {
    resolveRichText(input: TInput): TResult;
}

export interface IRichTextResolverAsync<TInput, TResult> {
    resolveRichTextAsync(input: TInput): Promise<TResult>;
}
