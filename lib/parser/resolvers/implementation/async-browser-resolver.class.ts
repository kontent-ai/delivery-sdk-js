import {
    IFeaturedObjects,
    IImageObject,
    ILinkedItemContentObject,
    ILinkObject,
    RichTextItemIndexReferenceWrapper
} from '../../parse-models';
import {
    IResolvedRichTextHtmlResult,
    IRichTextHtmlResolverAsyncInput,
} from '../../../resolvers/rich-text/rich-text.resolver';
import { parserConfiguration } from '../../parser-configuration';
import { ContentItemType } from '../../../models';
import { richTextResolverHelper } from '../shared/rich-text-resolver.helper';

export async function resolveBrowserRichTextInternalAsync(
    input: IRichTextHtmlResolverAsyncInput,
    html: string,
    linkedItemIndex: RichTextItemIndexReferenceWrapper = new RichTextItemIndexReferenceWrapper(0)
): Promise<IResolvedRichTextHtmlResult> {
    const rootElement = createWrapperElement(html);

    // get all linked items
    const result = await processRichTextElementAsync(
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
        linkedItemCodenames: result.linkedItems.filter((m) => m.itemType === 'linkedItem').map((m) => m.dataCodename),
        html: rootElement.innerHTML
    };
}

async function processRichTextElementAsync(
    input: IRichTextHtmlResolverAsyncInput,
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
                typeAttribute.value.toLowerCase() === parserConfiguration.modularContentElementData.type.toLowerCase()
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

                if (relAttribute && relAttribute.value === parserConfiguration.modularContentElementData.componentRel) {
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
                                      richTextResolverHelper.getLinkedItem(
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
                            await resolveBrowserRichTextInternalAsync(input, linkedItemHtml ?? '', linkedItemIndex)
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
                              link: richTextResolverHelper.tryGetLink(
                                  input.element,
                                  input.linkedItems ?? [],
                                  linkObject.dataItemId
                              ),
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
                              richTextResolverHelper.tryGetImage(
                                  input.element,
                                  input.linkedItems ?? [],
                                  imageObj.imageId
                              )
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
                await processRichTextElementAsync(input, element.children, result, linkedItemIndex);
            }
        }
    }

    return result;
}

function createWrapperElement(html: string): HTMLElement {
    const element = document.createElement(parserConfiguration.linkedItemWrapperElem);
    element.innerHTML = html;

    return element;
}
