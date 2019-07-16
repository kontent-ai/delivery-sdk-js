import { IRichTextResolverContext } from '../..//interfaces/item/irich-text-resolver-context';
import { ElementContracts } from '../../data-contracts/element-contracts';
import { ItemContracts } from '../../data-contracts/item-contracts';
import { IItemQueryConfig } from '../../interfaces/item/iitem-query.config';
import { ILinkResolverContext } from '../../interfaces/item/ilink-resolver-context';
import { ILinkResolverResult } from '../../interfaces/item/ilink-resolver-result';
import { IRichTextImageResolverResult } from '../../interfaces/item/irich-text-resolver-result';
import { ContentItem } from './content-item.class';
import { RichTextImage } from './image.class';
import { Link } from './link.class';

export type ElementCollisionResolver = (elementCodename: string) => string;
export type ItemPropertyResolver = (elementCodename: string) => string;
export type ItemLinkResolver = (link: Link, context: ILinkResolverContext) => string | undefined | ILinkResolverResult;
export type ItemRichTextResolver = (contentItem: ContentItem, context: IRichTextResolverContext) => string;
export type ItemResolver = (rawElement: ElementContracts.IElementContract, rawItem: ItemContracts.IContentItemContract, modularContent: any, queryConfig: IItemQueryConfig, ) => ContentItem | undefined;
export type RichTextImageResolver = (image: RichTextImage, elementName: string) => IRichTextImageResolverResult;
