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
} from './item-models';


export type ElementCollisionResolver = (elementCodename: string) => string;
export type ItemPropertyResolver = (elementCodename: string) => string;
export type ItemLinkResolver = (link: Link, context: ILinkResolverContext) => string | undefined | ILinkResolverResult;
export type ItemRichTextResolver = (contentItem: ContentItem, context: IRichTextResolverContext) => string;
export type ItemResolver = (rawElement: ElementContracts.IElementContract, rawItem: ItemContracts.IContentItemContract, modularContent: any, queryConfig: IItemQueryConfig, ) => ContentItem | undefined;
export type RichTextImageResolver = (image: RichTextImage, elementName: string) => IRichTextImageResolverResult;
