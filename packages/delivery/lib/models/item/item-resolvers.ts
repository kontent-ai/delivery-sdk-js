import { ElementContracts, ItemContracts } from '../../data-contracts';
import {
    ContentItem,
    IItemQueryConfig,
    ILinkResolverContext,
    ILinkResolverResult,
    IRichTextImageResolverResult,
    IRichTextResolverContext,
    Link,
    RichTextImage,
    IContentItem,
} from './item-models';


export type ElementCollisionResolver = (elementCodename: string) => string;
export type ItemPropertyResolver = (elementCodename: string) => string;
export type ItemLinkResolver = (link: Link, context: ILinkResolverContext) => string | undefined | ILinkResolverResult;
export type ItemRichTextResolver<TItem extends IContentItem> = (contentItem: TItem, context: IRichTextResolverContext) => string;
export type ItemResolver = (rawElement: ElementContracts.IElementContract, rawItem: ItemContracts.IContentItemContract, modularContent: ItemContracts.IModularContentContract, queryConfig: IItemQueryConfig) => ContentItem | undefined;
export type RichTextImageResolver = (image: RichTextImage, elementName: string) => IRichTextImageResolverResult;
