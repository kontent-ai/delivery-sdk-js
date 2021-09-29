import {
    IResolvedRichTextElement,
    IRichTextResolver,
    IRichTextAsyncResolver,
    IRichTextResolverAsyncInput,
    IRichTextResolverInput
} from '../../resolvers/rich-text.resolver';
import { ContentItemType, IContentItem, ILink, IRichTextImage } from '../../models';
import {
    IFeaturedObjects,
    IImageObject,
    ILinkedItemContentObject,
    ILinkObject,
    RichTextItemIndexReferenceWrapper
} from '../parse-models';
import { parserConfiguration } from '../parser-configuration';
import { ElementType } from '../../elements/element-type';
import { Elements } from '../../elements/elements';

export class BrowserRichTextResolver implements IRichTextResolver, IRichTextAsyncResolver {
    resolveRichText(input: IRichTextResolverInput): IResolvedRichTextElement {
        return this.resolveRichTextInternal(input, input.element.value);
    }

    async resolveRichTextAsync(input: IRichTextResolverAsyncInput): Promise<IResolvedRichTextElement> {
        return await this.resolveRichTextInternalAsync(input, input.element.value);
    }

    private resolveRichTextInternal(
        input: IRichTextResolverInput,
        html: string,
        linkedItemIndex: RichTextItemIndexReferenceWrapper = new RichTextItemIndexReferenceWrapper(0)
    ): IResolvedRichTextElement {
        const rootElement = this.createWrapperElement(html);

        // get all linked items
        const result = this.processRichTextElement(
            input,
            rootElement.children,
            {
                links: [],
                linkedItems: [],
                images: []
            },
            linkedItemIndex
        );

        return {
            componentCodenames: result.linkedItems.filter((m) => m.itemType === 'component').map((m) => m.dataCodename),
            linkedItemCodenames: result.linkedItems
                .filter((m) => m.itemType === 'linkedItem')
                .map((m) => m.dataCodename),
            html: rootElement.innerHTML
        };
    }

    private async resolveRichTextInternalAsync(
        input: IRichTextResolverAsyncInput,
        html: string,
        linkedItemIndex: RichTextItemIndexReferenceWrapper = new RichTextItemIndexReferenceWrapper(0)
    ): Promise<IResolvedRichTextElement> {
        const rootElement = this.createWrapperElement(html);

        // get all linked items
        const result = await this.processRichTextElementAsync(
            input,
            rootElement.children,
            {
                links: [],
                linkedItems: [],
                images: []
            },
            linkedItemIndex
        );

        return {
            componentCodenames: result.linkedItems.filter((m) => m.itemType === 'component').map((m) => m.dataCodename),
            linkedItemCodenames: result.linkedItems
                .filter((m) => m.itemType === 'linkedItem')
                .map((m) => m.dataCodename),
            html: rootElement.innerHTML
        };
    }

    private processRichTextElement(
        input: IRichTextResolverInput,
        htmlCollection: HTMLCollection,
        result: IFeaturedObjects,
        linkedItemIndex: RichTextItemIndexReferenceWrapper
    ): IFeaturedObjects {
        if (!htmlCollection || htmlCollection.length === 0) {
            // there are no more nodes
        } else {
            // extract objects
            for (let i = 0; i < htmlCollection.length; i++) {
                const element = htmlCollection[i];
                const typeAttribute = element.attributes ? element.attributes.getNamedItem('type') : undefined;

                // process linked items (modular items)
                if (
                    element.attributes &&
                    typeAttribute &&
                    typeAttribute.value &&
                    typeAttribute.value.toLowerCase() ===
                        parserConfiguration.modularContentElementData.type.toLowerCase()
                ) {
                    const dataCodenameAttribute = element.attributes.getNamedItem(
                        parserConfiguration.modularContentElementData.dataCodename
                    );
                    const dataTypeAttribute = element.attributes.getNamedItem(
                        parserConfiguration.modularContentElementData.dataType
                    );

                    if (!dataTypeAttribute) {
                        throw Error('Missing data type attribute. This is likely an error caused by invalid response.');
                    }

                    const relAttribute = element.attributes.getNamedItem(
                        parserConfiguration.modularContentElementData.relAttribute
                    );

                    let itemType: ContentItemType = 'linkedItem';

                    if (
                        relAttribute &&
                        relAttribute.value === parserConfiguration.modularContentElementData.componentRel
                    ) {
                        itemType = 'component';
                    }

                    // prepare link item object
                    const linkItemContentObject: ILinkedItemContentObject = {
                        dataCodename: dataCodenameAttribute ? dataCodenameAttribute.value : '',
                        dataType: dataTypeAttribute ? dataTypeAttribute.value : '',
                        itemType: itemType
                    };

                    // replace html
                    const parentElement = element.parentElement;

                    if (!parentElement) {
                        console.warn(
                            `Could not replace linked item '${linkItemContentObject.dataCodename}' of '${linkItemContentObject.dataType}' because parent node is undefined. Please report this error if you are seeing this.`
                        );
                    } else {
                        if (dataTypeAttribute.value === 'item') {
                            // add to result
                            result.linkedItems.push(linkItemContentObject);

                            // create new element
                            const newElem = document.createElement(parserConfiguration.linkedItemWrapperElem);

                            // get type of resolving item
                            const linkedItemHtml = input.contentItemResolver
                                ? input.contentItemResolver(
                                      this.getLinkedItem(input.linkedItems ?? [], linkItemContentObject.dataCodename)
                                  ).contentItemHtml
                                : undefined;

                            // add sdk resolved flag
                            newElem.setAttribute(parserConfiguration.resolvedLinkedItemAttribute, '1');

                            // add index to resolved item (can be useful for identifying linked item and may be used in WebSpotlight)
                            newElem.setAttribute(
                                parserConfiguration.resolvedLinkedItemIndexAttribute,
                                linkedItemIndex.index.toString()
                            );

                            // increment index
                            linkedItemIndex.increment();

                            // recursively run resolver on the HTML obtained by resolver
                            newElem.innerHTML = this.resolveRichTextInternal(
                                input,
                                linkedItemHtml ?? '',
                                linkedItemIndex
                            ).html;

                            // replace original node with new one
                            parentElement.replaceChild(newElem, element);
                        } else {
                            console.warn(
                                `Rich text element contains object with unsupported data type '${dataTypeAttribute.value}'`
                            );
                        }
                    }
                }

                // process links
                if (element.nodeName.toLowerCase() === parserConfiguration.linkElementData.nodeName.toLowerCase()) {
                    const dataItemIdAttribute = element.attributes.getNamedItem(
                        parserConfiguration.linkElementData.dataItemId
                    );

                    if (dataItemIdAttribute) {
                        const linkObject: ILinkObject = {
                            dataItemId: dataItemIdAttribute ? dataItemIdAttribute.value : ''
                        };

                        // add to result
                        result.links.push(linkObject);

                        // get original link text (the one inside <a> tag)
                        const linkText = element.innerHTML;

                        const urlSlugResult = input.urlResolver
                            ? input.urlResolver({
                                  link: this.tryGetLink(input.element, input.linkedItems ?? [], linkObject.dataItemId),
                                  linkText: linkText
                              })
                            : undefined;

                        // html has priority over url resolver
                        if (urlSlugResult?.linkHtml) {
                            // replace link html
                            element.outerHTML = urlSlugResult.linkHtml;
                        } else if (urlSlugResult?.linkUrl) {
                            // set link url only
                            const hrefAttribute = element.attributes.getNamedItem('href');

                            if (hrefAttribute) {
                                const linkUrlResult: string | undefined =
                                    typeof urlSlugResult === 'string' ? urlSlugResult : urlSlugResult.linkUrl;
                                hrefAttribute.value = linkUrlResult ? linkUrlResult : '';
                            }
                        }
                    }
                }

                // process images
                if (element.nodeName.toLowerCase() === parserConfiguration.imageElementData.nodeName.toLowerCase()) {
                    const dataImageIdAttribute = element.attributes.getNamedItem(
                        parserConfiguration.imageElementData.dataImageId
                    );

                    // continue only if data image id is present. There could be regular img tags included
                    if (dataImageIdAttribute) {
                        const imageObj: IImageObject = {
                            imageId: dataImageIdAttribute.value
                        };

                        result.images.push(imageObj);

                        // get image result
                        const imageResult = input.imageResolver
                            ? input.imageResolver(
                                  this.tryGetImage(input.element, input.linkedItems ?? [], imageObj.imageId)
                              )
                            : undefined;

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
                    }
                }

                // recursively process child nodes
                if (element.children && element.children.length > 0) {
                    this.processRichTextElement(input, element.children, result, linkedItemIndex);
                }
            }
        }

        return result;
    }

    private async processRichTextElementAsync(
        input: IRichTextResolverAsyncInput,
        htmlCollection: HTMLCollection,
        result: IFeaturedObjects,
        linkedItemIndex: RichTextItemIndexReferenceWrapper
    ): Promise<IFeaturedObjects> {
        if (!htmlCollection || htmlCollection.length === 0) {
            // there are no more nodes
        } else {
            // extract objects
            for (let i = 0; i < htmlCollection.length; i++) {
                const element = htmlCollection[i];
                const typeAttribute = element.attributes ? element.attributes.getNamedItem('type') : undefined;

                // process linked items (modular items)
                if (
                    element.attributes &&
                    typeAttribute &&
                    typeAttribute.value &&
                    typeAttribute.value.toLowerCase() ===
                        parserConfiguration.modularContentElementData.type.toLowerCase()
                ) {
                    const dataCodenameAttribute = element.attributes.getNamedItem(
                        parserConfiguration.modularContentElementData.dataCodename
                    );
                    const dataTypeAttribute = element.attributes.getNamedItem(
                        parserConfiguration.modularContentElementData.dataType
                    );

                    if (!dataTypeAttribute) {
                        throw Error('Missing data type attribute. This is likely an error caused by invalid response.');
                    }

                    const relAttribute = element.attributes.getNamedItem(
                        parserConfiguration.modularContentElementData.relAttribute
                    );

                    let itemType: ContentItemType = 'linkedItem';

                    if (
                        relAttribute &&
                        relAttribute.value === parserConfiguration.modularContentElementData.componentRel
                    ) {
                        itemType = 'component';
                    }

                    // prepare link item object
                    const linkItemContentObject: ILinkedItemContentObject = {
                        dataCodename: dataCodenameAttribute ? dataCodenameAttribute.value : '',
                        dataType: dataTypeAttribute ? dataTypeAttribute.value : '',
                        itemType: itemType
                    };

                    // replace html
                    const parentElement = element.parentElement;

                    if (!parentElement) {
                        console.warn(
                            `Could not replace linked item '${linkItemContentObject.dataCodename}' of '${linkItemContentObject.dataType}' because parent node is undefined. Please report this error if you are seeing this.`
                        );
                    } else {
                        if (dataTypeAttribute.value === 'item') {
                            // add to result
                            result.linkedItems.push(linkItemContentObject);

                            // create new element
                            const newElem = document.createElement(parserConfiguration.linkedItemWrapperElem);

                            // get type of resolving item
                            const linkedItemHtml = input.contentItemResolver
                                ? (
                                      await input.contentItemResolver(
                                          this.getLinkedItem(
                                              input.linkedItems ?? [],
                                              linkItemContentObject.dataCodename
                                          )
                                      )
                                  ).contentItemHtml
                                : undefined;

                            // add sdk resolved flag
                            newElem.setAttribute(parserConfiguration.resolvedLinkedItemAttribute, '1');

                            // add index to resolved item (can be useful for identifying linked item and may be used in WebSpotlight)
                            newElem.setAttribute(
                                parserConfiguration.resolvedLinkedItemIndexAttribute,
                                linkedItemIndex.index.toString()
                            );

                            // increment index
                            linkedItemIndex.increment();

                            // recursively run resolver on the HTML obtained by resolver
                            newElem.innerHTML = (
                                await this.resolveRichTextInternalAsync(input, linkedItemHtml ?? '', linkedItemIndex)
                            ).html;

                            // replace original node with new one
                            parentElement.replaceChild(newElem, element);
                        } else {
                            console.warn(
                                `Rich text element contains object with unsupported data type '${dataTypeAttribute.value}'`
                            );
                        }
                    }
                }

                // process links
                if (element.nodeName.toLowerCase() === parserConfiguration.linkElementData.nodeName.toLowerCase()) {
                    const dataItemIdAttribute = element.attributes.getNamedItem(
                        parserConfiguration.linkElementData.dataItemId
                    );

                    if (dataItemIdAttribute) {
                        const linkObject: ILinkObject = {
                            dataItemId: dataItemIdAttribute ? dataItemIdAttribute.value : ''
                        };

                        // add to result
                        result.links.push(linkObject);

                        // get original link text (the one inside <a> tag)
                        const linkText = element.innerHTML;

                        const urlSlugResult = input.urlResolver
                            ? await input.urlResolver({
                                  link: this.tryGetLink(input.element, input.linkedItems ?? [], linkObject.dataItemId),
                                  linkText: linkText
                              })
                            : undefined;

                        // html has priority over url resolver
                        if (urlSlugResult?.linkHtml) {
                            // replace link html
                            element.outerHTML = urlSlugResult.linkHtml;
                        } else if (urlSlugResult?.linkUrl) {
                            // set link url only
                            const hrefAttribute = element.attributes.getNamedItem('href');

                            if (hrefAttribute) {
                                const linkUrlResult: string | undefined =
                                    typeof urlSlugResult === 'string' ? urlSlugResult : urlSlugResult.linkUrl;
                                hrefAttribute.value = linkUrlResult ? linkUrlResult : '';
                            }
                        }
                    }
                }

                // process images
                if (element.nodeName.toLowerCase() === parserConfiguration.imageElementData.nodeName.toLowerCase()) {
                    const dataImageIdAttribute = element.attributes.getNamedItem(
                        parserConfiguration.imageElementData.dataImageId
                    );

                    // continue only if data image id is present. There could be regular img tags included
                    if (dataImageIdAttribute) {
                        const imageObj: IImageObject = {
                            imageId: dataImageIdAttribute.value
                        };

                        result.images.push(imageObj);

                        // get image result
                        const imageResult = input.imageResolver
                            ? await input.imageResolver(
                                  this.tryGetImage(input.element, input.linkedItems ?? [], imageObj.imageId)
                              )
                            : undefined;

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
                    }
                }

                // recursively process child nodes
                if (element.children && element.children.length > 0) {
                    await this.processRichTextElementAsync(input, element.children, result, linkedItemIndex);
                }
            }
        }

        return result;
    }

    private createWrapperElement(html: string): HTMLElement {
        const element = document.createElement(parserConfiguration.linkedItemWrapperElem);
        element.innerHTML = html;

        return element;
    }

    private getLinkedItem(linkedItems: IContentItem[], itemCodename: string): IContentItem | undefined {
        if (!linkedItems) {
            return undefined;
        }
        return linkedItems.find((m) => m.system.codename === itemCodename);
    }

    private tryGetImage(
        inputElement: Elements.RichTextElement,
        linkedItems: IContentItem[],
        imageId: string
    ): IRichTextImage | undefined {
        const elementImage = inputElement.images.find((m) => m.imageId === imageId);
        if (elementImage) {
            return elementImage;
        }

        // try to find image in all linked items
        if (linkedItems) {
            for (const linkedItem of linkedItems) {
                for (const elementKey of Object.keys(linkedItem.elements)) {
                    const element = linkedItem.elements[elementKey];
                    if (element.type === ElementType.RichText) {
                        const richTextElement = element as Elements.RichTextElement;
                        const richTextElementImage = richTextElement.images.find((m) => m.imageId === imageId);
                        if (richTextElementImage) {
                            return richTextElementImage;
                        }
                    }
                }
            }
        }

        return undefined;
    }

    private tryGetLink(
        inputElement: Elements.RichTextElement,
        linkedItems: IContentItem[],
        linkId: string
    ): ILink | undefined {
        const elementLink = inputElement.links.find((m) => m.linkId === linkId);
        if (elementLink) {
            return elementLink;
        }

        // try to find image in all linked items
        if (linkedItems) {
            for (const linkedItem of linkedItems) {
                for (const elementKey of Object.keys(linkedItem.elements)) {
                    const element = linkedItem.elements[elementKey];
                    if (element.type === ElementType.RichText) {
                        const richTextElement = element as Elements.RichTextElement;
                        const richTextElementLink = richTextElement.links.find((m) => m.linkId === linkId);
                        if (richTextElementLink) {
                            return richTextElementLink;
                        }
                    }
                }
            }
        }

        return undefined;
    }
}

export const browserRichTextResolver = new BrowserRichTextResolver();
