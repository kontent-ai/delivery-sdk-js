import { ItemContracts } from '../../data-contracts';
import {
    ContentItem,
    IContentItem,
    IRichTextImageResolverResult,
    IRichTextResolverContext,
    IUrlSlugResolverContext,
    IUrlSlugResolverResult,
    Link,
    RichTextImage
} from './item-models';

export type ElementCollisionResolver = (elementCodename: string) => string;
export type ItemPropertyResolver = (elementCodename: string) => string;
export type ItemUrlSlugResolver = (link: Link, context: IUrlSlugResolverContext) => IUrlSlugResolverResult | undefined;
export type ItemRichTextResolver = (contentItem: IContentItem<any>, context: IRichTextResolverContext) => string;
export type ItemResolver = (rawItem: ItemContracts.IContentItemContract) => ContentItem<any> | undefined;
export type RichTextImageResolver = (image: RichTextImage, elementName: string) => IRichTextImageResolverResult;
