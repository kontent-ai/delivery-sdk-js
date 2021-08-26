import { IContentItem, ItemUrlSlugResolver, IUrlSlugResolverResult } from '../models';
export declare class UrlSlugResolver {
    resolveUrl(data: {
        elementValue: string;
        elementName: string;
        item: IContentItem;
        resolver: ItemUrlSlugResolver;
        enableAdvancedLogging: boolean;
    }): IUrlSlugResolverResult;
}
export declare const urlSlugResolver: UrlSlugResolver;
