import { IParser, IParserAsync } from '../../parser';
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
    parser?: IParser<string>;
}

export interface IRichTextHtmlResolverInputAsync {
    element: Elements.RichTextElement;
    urlResolverAsync?: IRichTextUrlResolverAsync;
    imageResolverAsync?: IRichTextImageResolverAsync;
    contentItemResolverAsync?: IRichTextContentItemResolverAsync;
    linkedItems?: IContentItem[];
    parser?: IParserAsync<string>;
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
    sdkId: string;
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
