import { ElementModels } from '../elements';
import { IContentItem, IItemQueryConfig, ItemUrlSlugResolver, Link, RichTextImage } from '../models';
import { IRichTextHtmlParser } from '../parser';
export declare class RichTextResolver {
    /**
     * Resolves linked items inside the Rich text element.
     * Rich text resolved needs to be configured either on the model or query level
     */
    resolveData(contentItemCodename: string, html: string, elementName: string, data: {
        richTextHtmlParser: IRichTextHtmlParser;
        getLinkedItem: (codename: string) => IContentItem | undefined;
        getGlobalUrlSlugResolver: (type: string) => ItemUrlSlugResolver | undefined;
        links: Link[];
        images: RichTextImage[];
        enableAdvancedLogging: boolean;
        queryConfig: IItemQueryConfig;
        linkedItemWrapperTag: string;
        linkedItemWrapperClasses: string[];
    }): ElementModels.IRichTextResolverData;
    private getImageResult;
    private tryGetImageFromLinkedItem;
    private getLinkedItemHtml;
    private getUrlSlugResult;
}
export declare const richTextResolver: RichTextResolver;
