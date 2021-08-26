import { ItemContracts } from '../../data-contracts';
import { ContentItem, IContentItem, IRichTextImageResolverResult, IRichTextResolverContext, IUrlSlugResolverContext, IUrlSlugResolverResult, Link, RichTextImage } from './item-models';
export declare type ElementCollisionResolver = (elementCodename: string) => string;
export declare type ItemPropertyResolver = (elementCodename: string) => string;
export declare type ItemUrlSlugResolver = (link: Link, context: IUrlSlugResolverContext) => IUrlSlugResolverResult | undefined;
export declare type ItemRichTextResolver<TItem extends IContentItem> = (contentItem: TItem, context: IRichTextResolverContext) => string;
export declare type ItemResolver = (rawItem: ItemContracts.IContentItemContract) => ContentItem | undefined;
export declare type RichTextImageResolver = (image: RichTextImage, elementName: string) => IRichTextImageResolverResult;
