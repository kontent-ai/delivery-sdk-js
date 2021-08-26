"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserRichTextParser = void 0;
const models_1 = require("../../models");
const parse_models_1 = require("../parse-models");
const parser_configuration_1 = require("../parser-configuration");
class BrowserRichTextParser {
    resolveRichTextElement(contentItemCodename, html, elementName, replacement, config, linkedItemIndex = new parse_models_1.RichTextItemIndexReferenceWrapper(0)) {
        const doc = this.createWrapperElement(html);
        // get all linked items
        const result = this.processRichTextElement(contentItemCodename, elementName, doc.children, replacement, config, {
            links: [],
            linkedItems: [],
            images: []
        }, linkedItemIndex);
        return {
            links: result.links,
            linkedItems: result.linkedItems,
            images: result.images,
            resolvedHtml: doc.innerHTML
        };
    }
    createWrapperElement(html) {
        const element = document.createElement(parser_configuration_1.parserConfiguration.linkedItemWrapperElem);
        element.innerHTML = html;
        return element;
    }
    processRichTextElement(contentItemCodename, elementName, htmlCollection, replacement, config, result, linkedItemIndex) {
        if (!htmlCollection || htmlCollection.length === 0) {
            // there are no more nodes
        }
        else {
            // extract objects
            for (let i = 0; i < htmlCollection.length; i++) {
                const element = htmlCollection[i];
                const typeAttribute = element.attributes ? element.attributes.getNamedItem('type') : undefined;
                // process linked items (modular items)
                if (element.attributes &&
                    typeAttribute &&
                    typeAttribute.value &&
                    typeAttribute.value.toLowerCase() ===
                        parser_configuration_1.parserConfiguration.modularContentElementData.type.toLowerCase()) {
                    const dataCodenameAttribute = element.attributes.getNamedItem(parser_configuration_1.parserConfiguration.modularContentElementData.dataCodename);
                    const dataTypeAttribute = element.attributes.getNamedItem(parser_configuration_1.parserConfiguration.modularContentElementData.dataType);
                    if (!dataTypeAttribute) {
                        throw Error('Missing data type attribute. This is likely an error caused by invalid response.');
                    }
                    const relAttribute = element.attributes.getNamedItem(parser_configuration_1.parserConfiguration.modularContentElementData.relAttribute);
                    let itemType = 'linkedItem';
                    if (relAttribute &&
                        relAttribute.value === parser_configuration_1.parserConfiguration.modularContentElementData.componentRel) {
                        itemType = 'component';
                    }
                    // prepare link item object
                    const linkItemContentObject = {
                        dataCodename: dataCodenameAttribute ? dataCodenameAttribute.value : '',
                        dataType: dataTypeAttribute ? dataTypeAttribute.value : '',
                        itemType: itemType
                    };
                    // replace html
                    const parentElement = element.parentElement;
                    if (!parentElement) {
                        console.warn(`Could not replace linked item '${linkItemContentObject.dataCodename}' of '${linkItemContentObject.dataType}' because parent node is undefined. Please report this error if you are seeing this.`);
                    }
                    else {
                        if (dataTypeAttribute.value === 'item') {
                            // add to result
                            result.linkedItems.push(linkItemContentObject);
                            // create new element
                            const newElem = document.createElement(config.linkedItemWrapperTag);
                            // get type of resolving item
                            let type;
                            type = models_1.RichTextItemDataType.Item;
                            const linkedItemHtml = replacement.getLinkedItemHtml(linkItemContentObject.dataCodename, type);
                            // add sdk resolved flag
                            newElem.setAttribute(parser_configuration_1.parserConfiguration.resolvedLinkedItemAttribute, '1');
                            // add index to resolved item (can be useful for identifying linked item and may be used in WebSpotlight)
                            newElem.setAttribute(parser_configuration_1.parserConfiguration.resolvedLinkedItemIndexAttribute, linkedItemIndex.index.toString());
                            // increment index
                            linkedItemIndex.increment();
                            // recursively run resolver on the HTML obtained by resolver
                            newElem.innerHTML = this.resolveRichTextElement(linkItemContentObject.dataCodename, linkedItemHtml, elementName, replacement, config).resolvedHtml;
                            // add classes
                            newElem.className = config.linkedItemWrapperClasses.map((m) => m).join(' ');
                            // replace original node with new one
                            parentElement.replaceChild(newElem, element);
                        }
                        else {
                            if (config.enableAdvancedLogging) {
                                console.warn(`Rich text element contains object with unsupported data type '${dataTypeAttribute.value}'`);
                            }
                        }
                    }
                }
                // process links
                if (element.nodeName.toLowerCase() === parser_configuration_1.parserConfiguration.linkElementData.nodeName.toLowerCase()) {
                    const dataItemIdAttribute = element.attributes.getNamedItem(parser_configuration_1.parserConfiguration.linkElementData.dataItemId);
                    if (dataItemIdAttribute) {
                        const linkObject = {
                            dataItemId: dataItemIdAttribute ? dataItemIdAttribute.value : ''
                        };
                        // add to result
                        result.links.push(linkObject);
                        // get original link text (the one inside <a> tag)
                        const linkText = element.innerHTML;
                        const urlSlugResult = replacement.getUrlSlugResult(linkObject.dataItemId, linkText);
                        // html has priority over url resolver
                        if (urlSlugResult.html) {
                            // replace link html
                            const linkHtml = urlSlugResult.html;
                            element.outerHTML = linkHtml !== null && linkHtml !== void 0 ? linkHtml : '';
                        }
                        else if (urlSlugResult.url) {
                            // set link url only
                            const hrefAttribute = element.attributes.getNamedItem('href');
                            if (!hrefAttribute) {
                                // href attribute is missing
                                if (config.enableAdvancedLogging) {
                                    console.warn(`Cannot set url '${urlSlugResult}' because 'href' attribute is not present in the <a> tag.
                                        Please report this issue if you are seeing this.
                                        This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
                                }
                            }
                            else {
                                // get link url
                                const linkUrlResult = typeof urlSlugResult === 'string'
                                    ? urlSlugResult
                                    : urlSlugResult.url;
                                hrefAttribute.value = linkUrlResult ? linkUrlResult : '';
                            }
                        }
                    }
                }
                // process images
                if (element.nodeName.toLowerCase() === parser_configuration_1.parserConfiguration.imageElementData.nodeName.toLowerCase()) {
                    const dataImageIdAttribute = element.attributes.getNamedItem(parser_configuration_1.parserConfiguration.imageElementData.dataImageId);
                    // continue only if data image id is present. There could be regular img tags included
                    if (dataImageIdAttribute) {
                        const imageObj = {
                            imageId: dataImageIdAttribute.value
                        };
                        result.images.push(imageObj);
                        // get image result
                        const imageResult = replacement.getImageResult(contentItemCodename, imageObj.imageId, elementName);
                        // get src attribute of img tag
                        const srcAttribute = element.attributes.getNamedItem(parser_configuration_1.parserConfiguration.imageElementData.srcAttribute);
                        if (!srcAttribute) {
                            throw Error(`Attribute '${parser_configuration_1.parserConfiguration.imageElementData.srcAttribute}' is missing. Source element: ${elementName}`);
                        }
                        // set new image url
                        srcAttribute.value = imageResult.url;
                    }
                }
                // recursively process child nodes
                if (element.children && element.children.length > 0) {
                    this.processRichTextElement(contentItemCodename, elementName, element.children, replacement, config, result, linkedItemIndex);
                }
            }
        }
        return result;
    }
}
exports.BrowserRichTextParser = BrowserRichTextParser;
//# sourceMappingURL=browser-rich-text.parser.js.map