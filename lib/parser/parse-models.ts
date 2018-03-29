import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { ILink } from '../interfaces/item/ilink.interface';
import { TypeResolverService } from '../services/type-resolver.service';

export interface IModularContentObject {
    node: Node;
    dataType: string;
    dataCodename: string;
}

export interface ILinkObject {
    node: Node;
    dataItemId: string;
}

export interface IFeaturedObjects {
    links: ILinkObject[];
    modularContentItems: IModularContentObject[];
}

export interface IRichTextReplacements {
    contentItems: IContentItem[];
    links: ILink[];
}

export interface IRichTextResolverResult extends IFeaturedObjects {
    resolvedHtml: string;
}

export interface IHtmlResolverConfig {
    enableAdvancedLogging: boolean;
    queryConfig: IItemQueryConfig;
    typeResolverService: TypeResolverService;
}
