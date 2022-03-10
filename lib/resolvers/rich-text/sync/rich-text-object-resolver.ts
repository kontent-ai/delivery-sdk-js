import {
    IRichTextObjectResolverInput,
    IRichTextObjectContentItemData,
    IRichTextObjectLinkData,
    IRichTextObjectImageData,
    IRichTextObjectHtmlElementData,
    IRichTextObjectItem,
    IRichTextObjectAtribute,
    IRichTextObjectResult
} from '../rich-text-resolver.models';
import { browserParser, IParser, IParserElement } from '../../../parser';
import { guidHelper } from '../../../utilities';
import { BaseRichTextResolver } from '../base/base-rich-text-resolver';

export class RichTextObjectResolver extends BaseRichTextResolver<IRichTextObjectResolverInput, IRichTextObjectResult> {
    private readonly sdkIdAttributeName: string = 'sdk-elem-id';
    private readonly rootId: string = 'root';
    private readonly defaultWrapTag: string = 'div';

    constructor(parser?: IParser<string>) {
        super(browserParser, parser);
    }

    resolveRichText(input: IRichTextObjectResolverInput): IRichTextObjectResult {
        const result = this.resolveRichTextInternal(input.element.value, input, {
            type: 'root',
            attributes: [],
            children: [],
            data: {},
            tag: input.wrapperTag ?? this.defaultWrapTag,
            _sdkElemId: this.rootId
        });

        if (input.cleanSdkIds === true) {
            this.cleanSdkIds(result);
        }

        return {
            data: result
        };
    }

    private resolveRichTextInternal(
        html: string,
        input: IRichTextObjectResolverInput,
        result: IRichTextObjectItem
    ): IRichTextObjectItem {
        super.getParser().parse(
            html,
            input.element,
            {
                elementResolver: (element) => {
                    // generate guid for each element
                    element.setAttribute(this.sdkIdAttributeName, guidHelper.genereateGuid());
                },
                contentItemResolver: (element, itemCodename, linkedItemIndex, linkedItem) => {
                    const data: IRichTextObjectContentItemData = {
                        codename: itemCodename,
                        item: linkedItem
                    };

                    const parentSdkId = this.getSdkIdFromElement(element.parentElement);
                    const parentItem = this.findItemWithSdkId(parentSdkId, result);

                    if (parentItem) {
                        parentItem.children.push({
                            type: 'linkedItem',
                            attributes: this.getAttributes(element),
                            tag: element.tag.toLowerCase(),
                            data: data,
                            children: [],
                            _sdkElemId: this.getSdkIdFromElement(element)
                        });
                    }
                },
                genericElementResolver: (element) => {
                    const data: IRichTextObjectHtmlElementData = {
                        text: element.text ?? '',
                        html: element.html ?? ''
                    };

                    const parentSdkId = this.getSdkIdFromElement(element.parentElement);
                    const parentItem = this.findItemWithSdkId(parentSdkId, result);

                    if (parentItem) {
                        parentItem.children.push({
                            type: 'htmlElement',
                            attributes: this.getAttributes(element),
                            tag: element.tag.toLowerCase(),
                            data: data,
                            children: [],
                            _sdkElemId: this.getSdkIdFromElement(element)
                        });
                    }
                },
                imageResolver: (element, imageId, image) => {
                    const data: IRichTextObjectImageData = {
                        imageId: imageId,
                        image: image
                    };

                    const parentSdkId = this.getSdkIdFromElement(element.parentElement);
                    const parentItem = this.findItemWithSdkId(parentSdkId, result);

                    if (parentItem) {
                        parentItem.children.push({
                            type: 'image',
                            attributes: this.getAttributes(element),
                            tag: element.tag.toLowerCase(),
                            data: data,
                            children: [],
                            _sdkElemId: this.getSdkIdFromElement(element)
                        });
                    }
                },
                urlResolver: (element, linkId, linkText, link) => {
                    const data: IRichTextObjectLinkData = {
                        linkId: linkId,
                        linkText: linkText,
                        link: link
                    };

                    const parentSdkId = this.getSdkIdFromElement(element.parentElement);
                    const parentItem = this.findItemWithSdkId(parentSdkId, result);

                    if (parentItem) {
                        parentItem.children.push({
                            type: 'link',
                            attributes: this.getAttributes(element),
                            tag: element.tag.toLowerCase(),
                            data: data,
                            children: [],
                            _sdkElemId: this.getSdkIdFromElement(element)
                        });
                    }
                }
            },
            input.linkedItems ?? []
        );

        return result;
    }

    private findItemWithSdkId(sdkId: string, item: IRichTextObjectItem): IRichTextObjectItem | undefined {
        if (item._sdkElemId === sdkId) {
            return item;
        }

        for (const child of item.children) {
            const foundItem = this.findItemWithSdkId(sdkId, child);
            if (foundItem) {
                return foundItem;
            }
        }

        return undefined;
    }

    private getAttributes(element: IParserElement | undefined): IRichTextObjectAtribute[] {
        return element?.attributes ?? [];
    }

    private getSdkIdFromElement(element: IParserElement | undefined): string {
        if (!element) {
            return this.rootId;
        }
        const value = element.attributes.find((m) => m.name === this.sdkIdAttributeName)?.value ?? this.rootId;
        return value;
    }

    private cleanSdkIds(item: IRichTextObjectItem): void {
        item.attributes = item.attributes.filter((m) => m.name !== this.sdkIdAttributeName);
        item._sdkElemId = '';

        for (const child of item.children) {
            this.cleanSdkIds(child);
        }
    }
}

export const createRichTextObjectResolver = (parser?: IParser<any>) => new RichTextObjectResolver(parser);
