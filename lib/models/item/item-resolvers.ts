import { ElementContracts, ItemContracts } from '../../data-contracts';
import {
    ContentItem,
    IContentItem,
    IItemQueryConfig,
    IUrlSlugResolverContext,
    IRichTextImageResolverResult,
    IRichTextResolverContext,
    IUrlSlugResolverResult,
    Link,
    RichTextImage,
} from './item-models';

export type ElementCollisionResolver = (elementCodename: string) => string;
export type ItemPropertyResolver = (elementCodename: string) => string;
export type ItemUrlSlugResolver = (link: Link, context: IUrlSlugResolverContext) => IUrlSlugResolverResult | undefined;
export type ItemRichTextResolver<TItem extends IContentItem> = (contentItem: TItem, context: IRichTextResolverContext) => string;
export type ItemResolver = (rawElement: ElementContracts.IElementContract, rawItem: ItemContracts.IContentItemContract, modularContent: ItemContracts.IModularContentContract, queryConfig: IItemQueryConfig) => ContentItem | undefined;
export type RichTextImageResolver = (image: RichTextImage, elementName: string) => IRichTextImageResolverResult;
