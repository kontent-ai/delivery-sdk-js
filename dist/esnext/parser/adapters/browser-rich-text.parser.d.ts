import { IHtmlResolverConfig, IRichTextHtmlParser, IRichTextReplacements, IRichTextResolverResult, RichTextItemIndexReferenceWrapper } from '../parse-models';
export declare class BrowserRichTextParser implements IRichTextHtmlParser {
    resolveRichTextElement(contentItemCodename: string, html: string, elementName: string, replacement: IRichTextReplacements, config: IHtmlResolverConfig, linkedItemIndex?: RichTextItemIndexReferenceWrapper): IRichTextResolverResult;
    private createWrapperElement;
    private processRichTextElement;
}
