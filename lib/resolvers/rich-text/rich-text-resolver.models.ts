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

export type IAsyncRichTextUrlResolver = (linkId: string, linkText: string, link?: ILink) => Promise<IRichTextUrlResult>;
export type IAsyncRichTextImageResolver = (imageId: string, image?: IRichTextImage) => Promise<IRichTextImageResult>;
export type IAsyncRichTextContentItemResolver = (
    itemCodename: string,
    contentItem?: IContentItem
) => Promise<IRichTextContentItemResult>;

export interface IRichTextHtmlResolverInput {
    element: Elements.RichTextElement;
    urlResolver?: IRichTextUrlResolver;
    imageResolver?: IRichTextImageResolver;
    contentItemResolver?: IRichTextContentItemResolver;
    linkedItems?: IContentItem[];
    preserveResolvedObjectTags?: boolean;
}

export interface IAsyncRichTextHtmlResolverInput {
    element: Elements.RichTextElement;
    urlResolverAsync?: IAsyncRichTextUrlResolver;
    imageResolverAsync?: IAsyncRichTextImageResolver;
    contentItemResolverAsync?: IAsyncRichTextContentItemResolver;
    linkedItems?: IContentItem[];
    preserveResolvedObjectTags?: boolean;
}

export interface IRichTextResolver<TInput, TResult> {
    resolveRichText(input: TInput): TResult;
}

export interface IRichTextResolverAsync<TInput, TResult> {
    resolveRichTextAsync(input: TInput): Promise<TResult>;
}

export interface IRichTextObjectResolverInput {
    element: Elements.RichTextElement;
    linkedItems?: IContentItem[];
    cleanSdkIds?: boolean;

    /**
     * Tag that wraps content. Defaults to 'div'
     */
    wrapperTag?: string;
}

export type RichTextObjectDataType = 'linkedItem' | 'link' | 'image' | 'htmlElement' | 'root';

export interface IRichTextObjectContentItemData {
    item?: IContentItem;
    codename: string;
}

export interface IRichTextObjectLinkData {
    link?: ILink;
    linkId: string;
    linkText: string;
}

export interface IRichTextObjectImageData {
    image?: IRichTextImage;
    imageId: string;
}

export interface IRichTextObjectHtmlElementData {
    text: string | null;
    html: string | null;
}

export interface IRichTextObjectAtribute {
    name: string;
    value: string | null;
}

export interface IRichTextObjectItem {
    type: RichTextObjectDataType;
    tag: string;
    _sdkElemId: string;
    attributes: IRichTextObjectAtribute[];
    data: any;
    children: IRichTextObjectItem[];
}

export interface IRichTextJsonResult {
    json: string;
}
export interface IRichTextObjectResult {
    data: IRichTextObjectItem;
}
