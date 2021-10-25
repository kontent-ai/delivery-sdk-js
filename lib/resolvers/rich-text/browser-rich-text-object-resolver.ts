import {
    IRichTextResolver,
    IRichTextObjectResolverInput,
    IRichTextObjectContentItemData,
    IRichTextObjectLinkData,
    IRichTextObjectImageData,
    IRichTextObjectHtmlElementData,
    IRichTextObjectItem,
    IRichTextObjectAtribute
} from './rich-text.resolver';
import { browserParser } from '../../parser';
import { guidHelper } from '../../utilities';

export class BrowserRichTextObjectResolverExperimental
    implements IRichTextResolver<IRichTextObjectResolverInput, IRichTextObjectItem>
{
    private readonly sdkIdAttributeName: string = 'sdk-id';
    private readonly rootId: string = 'root';
    private readonly rootTag: string = 'p';

    resolveRichText(input: IRichTextObjectResolverInput): IRichTextObjectItem {
        const result = this.resolveRichTextInternal(input.element.value, input, {
            type: 'root',
            attributes: [],
            children: [],
            data: {},
            tag: this.rootTag,
            sdkId: this.rootId
        });

        if (input.removeSdkIds === true) {
            this.cleanSdkIds(result);
        }

        return result;
    }

    private resolveRichTextInternal(
        html: string,
        input: IRichTextObjectResolverInput,
        result: IRichTextObjectItem
    ): IRichTextObjectItem {
        browserParser.parse(
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
                            tag: element.tagName.toLowerCase(),
                            data: data,
                            children: [],
                            sdkId: this.getSdkIdFromElement(element)
                        });
                    }
                },
                genericElementResolver: (element) => {
                    const data: IRichTextObjectHtmlElementData = {
                        text: element.textContent,
                        html: element.innerHTML
                    };

                    const parentSdkId = this.getSdkIdFromElement(element.parentElement);
                    const parentItem = this.findItemWithSdkId(parentSdkId, result);

                    if (parentItem) {
                        parentItem.children.push({
                            type: 'htmlElement',
                            attributes: this.getAttributes(element),
                            tag: element.tagName.toLowerCase(),
                            data: data,
                            children: [],
                            sdkId: this.getSdkIdFromElement(element)
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
                            tag: element.tagName.toLowerCase(),
                            data: data,
                            children: [],
                            sdkId: this.getSdkIdFromElement(element)
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
                            tag: element.tagName.toLowerCase(),
                            data: data,
                            children: [],
                            sdkId: this.getSdkIdFromElement(element)
                        });
                    }
                }
            },
            input.linkedItems ?? []
        );

        return result;
    }

    private findItemWithSdkId(sdkId: string, item: IRichTextObjectItem): IRichTextObjectItem | undefined {
        if (item.sdkId === sdkId) {
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

    private getAttributes(element: Element): IRichTextObjectAtribute[] {
        const attributes: IRichTextObjectAtribute[] = [];

        for (let i = 0; i < element.attributes.length; i++) {
            const attribute = element.attributes[i];
            attributes.push({
                name: attribute.name,
                value: attribute.value
            });
        }

        return attributes;
    }

    private getSdkIdFromElement(element: Element | null): string {
        if (!element) {
            return this.rootId;
        }
        return element.getAttribute(this.sdkIdAttributeName) ?? this.rootId;
    }

    private cleanSdkIds(item: IRichTextObjectItem): void {
        item.attributes = item.attributes.filter((m) => m.name !== this.sdkIdAttributeName);
        item.sdkId = '';

        for (const child of item.children) {
            this.cleanSdkIds(child);
        }
    }
}

export const browserRichTextObjectResolverExperimental = new BrowserRichTextObjectResolverExperimental();
