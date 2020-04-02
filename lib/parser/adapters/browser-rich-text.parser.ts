import { ContentItemType, IUrlSlugResolverResult, RichTextItemDataType } from '../../models';
import {
    IFeaturedObjects,
    IHtmlResolverConfig,
    IImageObject,
    ILinkedItemContentObject,
    ILinkObject,
    IRichTextHtmlParser,
    IRichTextReplacements,
    IRichTextResolverResult,
    ResolverContext,
} from '../parse-models';
import { parserConfiguration } from '../parser-configuration';

export class BrowserRichTextParser implements IRichTextHtmlParser {
    resolveRichTextElement(
        resolverContext: ResolverContext,
        contentItemCodename: string,
        html: string,
        elementName: string,
        replacement: IRichTextReplacements,
        config: IHtmlResolverConfig
    ): IRichTextResolverResult {
        const doc = this.createWrapperElement(html);

        // get all linked items
        const result = this.processRichTextElement(
            resolverContext,
            contentItemCodename,
            elementName,
            doc.children,
            replacement,
            config,
            {
                links: [],
                linkedItems: [],
                images: []
            }
        );

        return {
            links: result.links,
            linkedItems: result.linkedItems,
            images: result.images,
            resolvedHtml: doc.innerHTML
        };
    }

    private createWrapperElement(html: string): HTMLElement {
        const element = document.createElement(parserConfiguration.linkedItemWrapperElem);
        element.innerHTML = html;

        return element;
    }

    private processRichTextElement(
        resolverContext: ResolverContext,
        contentItemCodename: string,
        elementName: string,
        htmlCollection: HTMLCollection,
        replacement: IRichTextReplacements,
        config: IHtmlResolverConfig,
        result: IFeaturedObjects
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
                            `Could not replace linked item '${linkItemContentObject.dataCodename}' of '${
                                linkItemContentObject.dataType
                            }' because parent node is undefined. Please report this error if you are seeing this.`
                        );
                    } else {
                        if (dataTypeAttribute.value === 'item') {
                            // add to result
                            result.linkedItems.push(linkItemContentObject);

                            // create new element
                            const newElem = document.createElement(config.linkedItemWrapperTag);

                            // get type of resolving item
                            let type: RichTextItemDataType | undefined;
                            type = RichTextItemDataType.Item;

                            const linkedItemHtml = replacement.getLinkedItemHtml(
                                linkItemContentObject.dataCodename,
                                type
                            );

                            // recursively run resolver on the HTML obtained by resolver
                            newElem.innerHTML = this.resolveRichTextElement(
                                'nested',
                                linkItemContentObject.dataCodename,
                                linkedItemHtml,
                                elementName,
                                replacement,
                                config
                            ).resolvedHtml;

                            // add classes
                            newElem.className = config.linkedItemWrapperClasses.map(m => m).join(' ');

                            // replace original node with new one
                            parentElement.replaceChild(newElem, element);
                        } else {
                            if (config.enableAdvancedLogging) {
                                console.warn(
                                    `Rich text element contains object with unsupported data type '${
                                        dataTypeAttribute.value
                                    }'`
                                );
                            }
                        }
                    }
                }

                // process links
                if (element.nodeName.toLowerCase() === parserConfiguration.linkElementData.nodeName.toLowerCase()) {
                    const dataItemIdAttribute = element.attributes.getNamedItem(
                        parserConfiguration.linkElementData.dataItemId
                    );

                    if (dataItemIdAttribute) {
                        const link: ILinkObject = {
                            dataItemId: dataItemIdAttribute ? dataItemIdAttribute.value : ''
                        };

                        // add to result
                        result.links.push(link);

                        // get original link text (the one inside <a> tag)
                        const linkText = element.innerHTML;

                        const urlSlugResult = replacement.getUrlSlugResult(link.dataItemId, linkText);

                        // html has priority over url resolver
                        if (urlSlugResult.html) {
                            // replace link html
                            const linkHtml = (<IUrlSlugResolverResult>urlSlugResult).html;
                            element.outerHTML = linkHtml ?? '';
                        } else if (urlSlugResult.url) {
                            // set link url only
                            const hrefAttribute = element.attributes.getNamedItem('href');
                            if (!hrefAttribute) {
                                // href attribute is missing
                                if (config.enableAdvancedLogging) {
                                    console.warn(
                                        `Cannot set url '${urlSlugResult}' because 'href' attribute is not present in the <a> tag.
                                        Please report this issue if you are seeing this.
                                        This warning can be turned off by disabling 'enableAdvancedLogging' option.`
                                    );
                                }
                            } else {
                                // get link url
                                const linkUrlResult: string | undefined =
                                    typeof urlSlugResult === 'string'
                                        ? <string>urlSlugResult
                                        : (<IUrlSlugResolverResult>urlSlugResult).url;
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
                        const imageResult = replacement.getImageResult(
                            resolverContext,
                            contentItemCodename,
                            imageObj.imageId,
                            elementName
                        );

                        // get src attribute of img tag
                        const srcAttribute = element.attributes.getNamedItem(
                            parserConfiguration.imageElementData.srcAttribute
                        );

                        if (!srcAttribute) {
                            throw Error(
                                `Attribute '${
                                    parserConfiguration.imageElementData.srcAttribute
                                }' is missing. Source element: ${elementName}`
                            );
                        }

                        // set new image url
                        srcAttribute.value = imageResult.url;
                    }
                }

                // recursively process child nodes
                if (element.children && element.children.length > 0) {
                    this.processRichTextElement(
                        resolverContext,
                        contentItemCodename,
                        elementName,
                        element.children,
                        replacement,
                        config,
                        result
                    );
                }
            }
        }

        return result;
    }
}
