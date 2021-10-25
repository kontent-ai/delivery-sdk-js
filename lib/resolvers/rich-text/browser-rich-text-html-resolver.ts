import {
    IResolvedRichTextHtmlResult,
    IRichTextResolver,
    IRichTextResolverAsync,
    IRichTextHtmlResolverInputAsync,
    IRichTextHtmlResolverInput
} from './rich-text.resolver';
import { browserParser, browserParserAsync, parserConfiguration } from '../../parser';

export class BrowserRichTextHtmlResolver
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
        const parsedResult = browserParser.parse(
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

                        // replace original node with new one
                        parentElement.replaceChild(newElem, element);
                    }
                },
                genericElementResolver: (element) => {
                    // do nothing to generic elements
                },
                imageResolver: (element, imageId, image) => {
                    // get image result
                    const imageResult = input.imageResolver ? input.imageResolver(imageId, image) : undefined;

                    // get src attribute of img tag
                    const srcAttribute = element.attributes.getNamedItem(
                        parserConfiguration.imageElementData.srcAttribute
                    );

                    if (!srcAttribute) {
                        throw Error(`Attribute '${parserConfiguration.imageElementData.srcAttribute}' is invalid`);
                    }

                    // html has priority over url resolver
                    if (imageResult?.imageHtml) {
                        // replace link html
                        element.outerHTML = imageResult.imageHtml;
                    } else if (imageResult?.imageUrl) {
                        // set link url only
                        srcAttribute.value = imageResult?.imageUrl ?? '';
                    }
                },
                urlResolver: (element, linkId, linkText, link) => {
                    if (input.urlResolver) {
                        const urlResult = input.urlResolver(linkId, linkText, link);

                        // html has priority over url resolver
                        if (urlResult?.linkHtml) {
                            // replace link html
                            element.outerHTML = urlResult.linkHtml;
                        } else if (urlResult?.linkUrl) {
                            // set link url only
                            const hrefAttribute = element.attributes.getNamedItem('href');

                            if (hrefAttribute) {
                                const linkUrlResult: string | undefined =
                                    typeof urlResult === 'string' ? urlResult : urlResult.linkUrl;
                                hrefAttribute.value = linkUrlResult ? linkUrlResult : '';
                            }
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
        const parsedResult = await browserParserAsync.parseAsync(
            html,
            input.element,
            {
                elementResolver: (element) => {},
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

                        // replace original node with new one
                        parentElement.replaceChild(newElem, element);
                    }
                },
                genericElementResolverAsync: async (element) => {
                    // do nothing to generic elements
                },
                imageResolverAsync: async (element, imageId, image) => {
                    // get image result
                    const imageResult = input.imageResolverAsync ? await input.imageResolverAsync(imageId, image) : undefined;

                    // get src attribute of img tag
                    const srcAttribute = element.attributes.getNamedItem(
                        parserConfiguration.imageElementData.srcAttribute
                    );

                    if (!srcAttribute) {
                        throw Error(`Attribute '${parserConfiguration.imageElementData.srcAttribute}' is invalid`);
                    }

                    // html has priority over url resolver
                    if (imageResult?.imageHtml) {
                        // replace link html
                        element.outerHTML = imageResult.imageHtml;
                    } else if (imageResult?.imageUrl) {
                        // set link url only
                        srcAttribute.value = imageResult?.imageUrl ?? '';
                    }
                },
                urlResolverAsync: async (element, linkId, linkText, link) => {
                    if (input.urlResolverAsync) {
                        const urlResult = await input.urlResolverAsync(linkId, linkText, link);

                        // html has priority over url resolver
                        if (urlResult?.linkHtml) {
                            // replace link html
                            element.outerHTML = urlResult.linkHtml;
                        } else if (urlResult?.linkUrl) {
                            // set link url only
                            const hrefAttribute = element.attributes.getNamedItem('href');

                            if (hrefAttribute) {
                                const linkUrlResult: string | undefined =
                                    typeof urlResult === 'string' ? urlResult : urlResult.linkUrl;
                                hrefAttribute.value = linkUrlResult ? linkUrlResult : '';
                            }
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

export const browserRichTextHtmlResolver = new BrowserRichTextHtmlResolver();
