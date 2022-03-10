import { IResolvedRichTextHtmlResult, IRichTextHtmlResolverInput } from '../rich-text-resolver.models';
import { browserParser, IParser, parserConfiguration, parserHelper } from '../../../parser';
import { BaseRichTextResolver } from '../base/base-rich-text-resolver';

export class RichTextHtmlResolver extends BaseRichTextResolver<
    IRichTextHtmlResolverInput,
    IResolvedRichTextHtmlResult
> {
    constructor(parser?: IParser<string>) {
        super(browserParser, parser);
    }

    resolveRichText(input: IRichTextHtmlResolverInput): IResolvedRichTextHtmlResult {
        return this.resolveRichTextInternal(input.element.value, input);
    }

    private resolveRichTextInternal(html: string, input: IRichTextHtmlResolverInput): IResolvedRichTextHtmlResult {
        const parsedResult = super.getParser().parse(
            html,
            input.element,
            {
                elementResolver: (element) => {},
                contentItemResolver: (element, itemCodename, linkedItemIndex, linkedItem) => {
                    const parentElement = element.parentElement;

                    if (parentElement) {
                        const resolvedItemHtml = input.contentItemResolver
                            ? input.contentItemResolver(itemCodename, linkedItem).contentItemHtml ?? ''
                            : '';

                        // resursively resolve HTML
                        const innerHtml = this.resolveRichTextInternal(resolvedItemHtml, input).html;

                        // set resolved html
                        if (input.preserveResolvedObjectTags === true) {
                            element.setInnerHtml(innerHtml);
                        } else {
                            element.setOuterHtml(innerHtml);
                        }

                        // set resolved attribute
                        element.setAttribute(parserHelper.sdkResolvedAttributeName, '1');
                    }
                },
                genericElementResolver: (element) => {
                    // do nothing to generic elements
                },
                imageResolver: (element, imageId, image) => {
                    // get image result
                    const imageResult = input.imageResolver ? input.imageResolver(imageId, image) : undefined;

                    // html has priority over url resolver
                    if (imageResult?.imageHtml) {
                        // replace link html
                        element.setOuterHtml(imageResult.imageHtml);
                    } else if (imageResult?.imageUrl) {
                        // set link url only
                        element.setAttribute(parserConfiguration.imageElementData.srcAttribute, imageResult.imageUrl);
                    }
                },
                urlResolver: (element, linkId, linkText, link) => {
                    if (input.urlResolver) {
                        const urlResult = input.urlResolver(linkId, linkText, link);

                        // html has priority over url resolver
                        if (urlResult?.linkHtml) {
                            // replace link html
                            element.setOuterHtml(urlResult.linkHtml);
                        } else if (urlResult?.linkUrl) {
                            // set link url only
                            element.setAttribute('href', urlResult.linkUrl);
                        }
                    }
                }
            },
            input.linkedItems ?? []
        );

        return {
            componentCodenames: parsedResult.componentCodenames,
            linkedItemCodenames: parsedResult.linkedItemCodenames,
            html: parsedResult.result
        };
    }
}

export const createRichTextHtmlResolver = (parser?: IParser<string>) => new RichTextHtmlResolver(parser);
