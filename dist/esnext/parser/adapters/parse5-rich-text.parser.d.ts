import { IHtmlResolverConfig, IRichTextHtmlParser, IRichTextReplacements, IRichTextResolverResult, RichTextItemIndexReferenceWrapper } from '../parse-models';
export declare class Parse5RichTextParser implements IRichTextHtmlParser {
    resolveRichTextElement(contentItemCodename: string, html: string, elementName: string, replacement: IRichTextReplacements, config: IHtmlResolverConfig, linkedItemIndex?: RichTextItemIndexReferenceWrapper): IRichTextResolverResult;
    private processRichTextElement;
    private processImage;
    private processLink;
    private processModularContentItem;
    private getChildNodes;
}
