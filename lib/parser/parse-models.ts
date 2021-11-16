import { Elements } from '../elements/elements';
import { ContentItemType, IContentItem, ILink, IRichTextImage } from '../models';

/**
 * This class as a wrapper is required so we can pass
 * index as a reference and not a value
 */
 export class ParsedItemIndexReferenceWrapper {
    constructor(public index: number) {}

    increment(): void {
        this.index++;
    }
}

export interface IParsedObjects {
    links: ILinkObject[];
    linkedItems: ILinkedItemContentObject[];
    images: IImageObject[];
}


export interface ILinkedItemContentObject {
    dataType: string;
    dataCodename: string;
    itemType: ContentItemType;
}

export interface ILinkObject {
    dataItemId: string;
}

export interface IImageObject {
    imageId: string;
}

export interface IParserElementAttribute {
    name: string;
    value: string;
}


export interface IParserElement {
    attributes: IParserElementAttribute[];
    html?: string;
    text?: string;
    parentElement?: IParserElement;
    tag: string;
    setOuterHtml: (newHtml: string) => void;
    setInnerHtml: (newHtml: string) => void;
    setAttribute: (attributeName: string, attributeValue?: string) => void;
    sourceElement: any;
}

export interface IParseResolvers {
    elementResolver: (element: IParserElement) => void;
    genericElementResolver: (element: IParserElement) => void;
    urlResolver: (element: IParserElement, linkId: string, linkText: string, link?: ILink) => void;
    imageResolver: (element: IParserElement, imageId: string, image?: IRichTextImage) => void;
    contentItemResolver: (element: IParserElement, linkedItemCodename: string, linkedItemIndex: number, linkedItem?: IContentItem) => void;
}

export interface IAsyncParseResolvers {
    elementResolverAsync: (element: IParserElement) => Promise<void>;
    genericElementResolverAsync: (element: IParserElement) => Promise<void>;
    urlResolverAsync: (element: IParserElement, linkId: string, linkText: string, link?: ILink) => Promise<void>;
    imageResolverAsync: (element: IParserElement, imageId: string, image?: IRichTextImage) => Promise<void>;
    contentItemResolverAsync: (element: IParserElement, linkedItemCodename: string, linkedItemIndex: number, linkedItem?: IContentItem) => Promise<void>;
}

export interface IParserResult<TParserOutput> {
    result: TParserOutput;
    linkedItemCodenames: string[];
    componentCodenames: string[];
}

export interface IParser<TParserOutput> {
    parse(
        html: string,
        mainRichTextElement: Elements.RichTextElement,
        resolvers: IParseResolvers,
        linkedItems: IContentItem[]
    ): IParserResult<TParserOutput>;
}

export interface IAsyncParser<TParserOutput> {
    parseAsync(
        html: string,
        mainRichTextElement: Elements.RichTextElement,
        resolvers: IAsyncParseResolvers,
        linkedItems: IContentItem[]
    ): Promise<IParserResult<TParserOutput>>;
}
