import { IResolvedRichTextHtmlResult, IAsyncRichTextHtmlResolverInput } from '../rich-text-resolver.models';
import { asyncBrowserParser, IAsyncParser, parserConfiguration, parserHelper } from '../../../parser';
import { BaseAsyncRichTextResolver } from '../base/base-async-rich-text-resolver';

export class AsyncRichTextHtmlResolver extends BaseAsyncRichTextResolver<
    IAsyncRichTextHtmlResolverInput,
    IResolvedRichTextHtmlResult
> {
    constructor(parser?: IAsyncParser<string>) {
        super(asyncBrowserParser, parser);
    }

    async resolveRichTextAsync(input: IAsyncRichTextHtmlResolverInput): Promise<IResolvedRichTextHtmlResult> {
        return await this.resolveRichTextInternalAsync(input.element.value, input);
    }

    private async resolveRichTextInternalAsync(
        html: string,
        input: IAsyncRichTextHtmlResolverInput
    ): Promise<IResolvedRichTextHtmlResult> {
        const parsedResult = await super.getAsyncParser().parseAsync(
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

                        // resursively resolve HTML
                        const innerHtml = (await this.resolveRichTextInternalAsync(resolvedItemHtml, input)).html;

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
}

export const createAsyncRichTextHtmlResolver = (parser?: IAsyncParser<string>) => new AsyncRichTextHtmlResolver(parser);
