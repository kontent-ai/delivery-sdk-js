import {
    IResolvedRichTextHtmlResult,
    IRichTextResolver,
    IRichTextResolverAsync,
    IRichTextHtmlResolverInputAsync,
    IRichTextHtmlResolverInput
} from './rich-text-resolver.models';
import { browserParser, browserParserAsync, IParser, IParserAsync, parserConfiguration } from '../../parser';

export class RichTextHtmlResolver
    implements
        IRichTextResolver<IRichTextHtmlResolverInput, IResolvedRichTextHtmlResult>,
        IRichTextResolverAsync<IRichTextHtmlResolverInputAsync, IResolvedRichTextHtmlResult>
{
    resolveRichText(input: IRichTextHtmlResolverInput): IResolvedRichTextHtmlResult {
        return this.resolveRichTextInternal(input.element.value, input);
    }

    async resolveRichTextAsync(input: IRichTextHtmlResolverInputAsync): Promise<IResolvedRichTextHtmlResult> {
        return await this.resolveRichTextInternalAsync(input.element.value, input);
    }

    private resolveRichTextInternal(html: string, input: IRichTextHtmlResolverInput): IResolvedRichTextHtmlResult {
        const parsedResult = this.getParser(input.parser).parse(
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

                        // create new element
                        const newElem = document.createElement(parserConfiguration.linkedItemWrapperElem);

                        // resursively resolve HTML
                        newElem.innerHTML = this.resolveRichTextInternal(resolvedItemHtml, input).html;

                        // add sdk resolved flag
                        newElem.setAttribute(parserConfiguration.resolvedLinkedItemAttribute, '1');

                        // add index to resolved item (can be useful for identifying linked item and may be used in WebSpotlight)
                        newElem.setAttribute(
                            parserConfiguration.resolvedLinkedItemIndexAttribute,
                            linkedItemIndex.toString()
                        );

                        // set resolved html
                        element.setOuterHtml(newElem.outerHTML);
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

    private async resolveRichTextInternalAsync(
        html: string,
        input: IRichTextHtmlResolverInputAsync
    ): Promise<IResolvedRichTextHtmlResult> {
        const parsedResult = await this.getAsyncParser(input.parser).parseAsync(
            html,
            input.element,
            {
                elementResolverAsync: async (element) => {},
                contentItemResolverAsync: async (element, itemCodename, linkedItemIndex, linkedItem) => {
                    const parentElement = element.parentElement;

                    if (parentElement) {
                        const resolvedItemHtml = input.contentItemResolverAsync
                            ? (await input.contentItemResolverAsync(itemCodename, linkedItem)).contentItemHtml ?? ''
                            : '';

                        // create new element
                        const newElem = document.createElement(parserConfiguration.linkedItemWrapperElem);

                        // resursively resolve HTML
                        newElem.innerHTML = (await this.resolveRichTextInternalAsync(resolvedItemHtml, input)).html;

                        // add sdk resolved flag
                        newElem.setAttribute(parserConfiguration.resolvedLinkedItemAttribute, '1');

                        // add index to resolved item (can be useful for identifying linked item and may be used in WebSpotlight)
                        newElem.setAttribute(
                            parserConfiguration.resolvedLinkedItemIndexAttribute,
                            linkedItemIndex.toString()
                        );

                        // set resolved html
                        element.setOuterHtml(newElem.outerHTML);
                    }
                },
                genericElementResolverAsync: async (element) => {
                    // do nothing to generic elements
                },
                imageResolverAsync: async (element, imageId, image) => {
                    // get image result
                    const imageResult = input.imageResolverAsync
                        ? await input.imageResolverAsync(imageId, image)
                        : undefined;

                    // html has priority over url resolver
                    if (imageResult?.imageHtml) {
                        // replace link html
                        element.setOuterHtml(imageResult.imageHtml);
                    } else if (imageResult?.imageUrl) {
                        // set link url only
                        element.setAttribute(parserConfiguration.imageElementData.srcAttribute, imageResult.imageUrl);
                    }
                },
                urlResolverAsync: async (element, linkId, linkText, link) => {
                    if (input.urlResolverAsync) {
                        const urlResult = await input.urlResolverAsync(linkId, linkText, link);

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

    private getParser(parser?: IParser<string>): IParser<string> {
        if (parser) {
            return parser;
        }

        // return browser parser by default
        return browserParser;
    }

    private getAsyncParser(parser?: IParserAsync<string>): IParserAsync<string> {
        if (parser) {
            return parser;
        }

        // return browser parser by default
        return browserParserAsync;
    }
}

export const richTextHtmlResolver = new RichTextHtmlResolver();
