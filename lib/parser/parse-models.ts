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

export interface IParseResolvers {
    htmlElementResolver: (element: Element) => void;
    urlResolver: (element: Element, linkId: string, linkText: string, link?: ILink) => void;
    imageResolver: (element: Element, imageId: string, image?: IRichTextImage) => void;
    contentItemResolver: (element: Element, linkedItemCodename: string, linkedItemIndex: number, linkedItem?: IContentItem) => void;
}

export interface IParseResolversAsync {
    htmlElementResolverAsync: (element: Element) => Promise<void>;
    urlResolverAsync: (element: Element, linkId: string, linkText: string, link?: ILink) => Promise<void>;
    imageResolverAsync: (element: Element, imageId: string, image?: IRichTextImage) => Promise<void>;
    contentItemResolverAsync: (element: Element, linkedItemCodename: string, linkedItemIndex: number, linkedItem?: IContentItem) => Promise<void>;
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

export interface IParserAsync<TParserOutput> {
    parseAsync(
        html: string,
        mainRichTextElement: Elements.RichTextElement,
        resolvers: IParseResolversAsync,
        linkedItems: IContentItem[]
    ): Promise<IParserResult<TParserOutput>>;
}
