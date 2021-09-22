import {
    IContentItem,
    IRichTextImageResolverResult,
    IRichTextResolverContext,
    IUrlSlugResolverContext,
    IUrlSlugResolverResult,
    ILink,
    IRichTextImage
} from './item-models';

export type ElementCollisionResolver = (elementCodename: string) => string;
export type PropertyNameResolver = (contentTypeCodename: string, elementCodename: string) => string;
export type ItemUrlSlugResolver = (link: ILink, context: IUrlSlugResolverContext) => IUrlSlugResolverResult | undefined;
export type ItemRichTextResolver = (contentItem: IContentItem<any>, context: IRichTextResolverContext) => string;
export type RichTextImageResolver = (image: IRichTextImage, elementName: string) => IRichTextImageResolverResult;
