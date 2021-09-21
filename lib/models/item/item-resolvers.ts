import {
    IContentItem,
    IRichTextImageResolverResult,
    IRichTextResolverContext,
    IUrlSlugResolverContext,
    IUrlSlugResolverResult,
    Link,
    RichTextImage
} from './item-models';

export type ElementCollisionResolver = (elementCodename: string) => string;
export type PropertyNameResolver = (contentTypeCodename: string, elementCodename: string) => string;
export type ItemUrlSlugResolver = (link: Link, context: IUrlSlugResolverContext) => IUrlSlugResolverResult | undefined;
export type ItemRichTextResolver = (contentItem: IContentItem<any>, context: IRichTextResolverContext) => string;
export type RichTextImageResolver = (image: RichTextImage, elementName: string) => IRichTextImageResolverResult;
