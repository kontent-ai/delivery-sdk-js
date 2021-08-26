import { parseFragment, serialize } from 'parse5';
import { RichTextItemDataType } from '../../models';
import { RichTextItemIndexReferenceWrapper } from '../parse-models';
import { parserConfiguration } from '../parser-configuration';
export class Parse5RichTextParser {
    resolveRichTextElement(contentItemCodename, html, elementName, replacement, config, linkedItemIndex = new RichTextItemIndexReferenceWrapper(0)) {
        // create document
        const documentFragment = parseFragment(html);
        // get all linked items
        const result = this.processRichTextElement(contentItemCodename, elementName, this.getChildNodes(documentFragment), replacement, config, {
            links: [],
            linkedItems: [],
            images: []
        }, linkedItemIndex);
        const resolvedHtml = serialize(documentFragment);
        return {
            links: result.links,
            linkedItems: result.linkedItems,
            images: result.images,
            resolvedHtml: resolvedHtml
        };
    }
    processRichTextElement(contentItemCodename, elementName, elements, replacement, config, result, linkedItemIndex) {
        if (!elements || elements.length === 0) {
            // there are no more elements
        }
        else {
            elements.forEach((element) => {
                if (element.attrs) {
                    this.processModularContentItem(elementName, element, replacement, config, result, linkedItemIndex);
                    this.processImage(contentItemCodename, elementName, element, replacement, config, result);
                    this.processLink(element, replacement, config, result);
                }
                if (element.childNodes) {
                    // recursively process all childs
                    this.processRichTextElement(contentItemCodename, elementName, this.getChildNodes(element), replacement, config, result, linkedItemIndex);
                }
            });
        }
        return result;
    }
    processImage(contentItemCodename, elementName, element, replacement, config, result) {
        const attributes = element.attrs;
        if (element.nodeName !== parserConfiguration.imageElementData.nodeName) {
            // node is not an image
            return;
        }
        // get image id attribute
        const dataImageIdAttribute = attributes.find((m) => m.name === parserConfiguration.imageElementData.dataImageId);
        if (!dataImageIdAttribute) {
            // image tag does not have image id attribute
            return;
        }
        // prepare link object
        const image = {
            imageId: dataImageIdAttribute.value
        };
        // add link to result
        result.images.push(image);
        const linkResult = replacement.getImageResult(contentItemCodename, image.imageId, elementName);
        // set url of image
        const srcAttribute = attributes.find((m) => m.name === parserConfiguration.imageElementData.srcAttribute);
        if (srcAttribute) {
            srcAttribute.value = linkResult.url;
        }
    }
    processLink(element, replacement, config, result) {
        const attributes = element.attrs;
        if (element.nodeName !== parserConfiguration.linkElementData.nodeName) {
            // node is not a link
            return;
        }
        // get all links which have item it attribute, ignore all other links (they can be regular links in rich text)
        const dataItemIdAttribute = attributes.find((m) => m.name === parserConfiguration.linkElementData.dataItemId);
        if (!dataItemIdAttribute) {
            // its either a regular link or the attribute is not defined
            return;
        }
        // prepare link object
        const link = {
            dataItemId: dataItemIdAttribute ? dataItemIdAttribute.value : ''
        };
        // add link to result
        result.links.push(link);
        // get original link text (the one inside <a> tag from response)
        let originalLinkText = undefined;
        const linkTextNode = element.childNodes[0];
        if (linkTextNode) {
            originalLinkText = linkTextNode.value;
        }
        const urlSlugResult = replacement.getUrlSlugResult(link.dataItemId, originalLinkText || '');
        // html has priority over url
        if (urlSlugResult.html) {
            // replace entire link html
            const linkHtml = urlSlugResult.html
                ? urlSlugResult.html
                : '';
            if (linkHtml) {
                const linkRootNodes = parseFragment(linkHtml).childNodes;
                if (linkRootNodes.length !== 1) {
                    throw Error(`Invalid number of root nodes.`);
                }
                const linkRootNode = linkRootNodes[0];
                const linkNodes = linkRootNode.childNodes;
                if (linkNodes.length !== 1) {
                    throw Error(`When specifying 'html' in urlSlugResolver be sure to use single wrapper element.
                    Valid syntax: '<p>data</p>'
                    Invalid syntax: '<p><data></p><p>another data</p>'`);
                }
                element.attrs = linkRootNode.attrs; //  preserve attributes from top node
                element.tagName = linkRootNodes[0].tagName; // use first node as a tag wrapper
                element.childNodes = linkNodes;
            }
        }
        else if (urlSlugResult.url) {
            // replace just link href
            const hrefAttribute = attributes.find((m) => m.name === 'href');
            if (!hrefAttribute) {
                // href attribute is missing
                if (config.enableAdvancedLogging) {
                    console.warn(`Cannot set url '${urlSlugResult}' because 'href' attribute is not present in the <a> tag. Please report this issue if you are seeing this. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
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
    processModularContentItem(elementName, element, replacement, config, result, linkedItemIndex) {
        const attributes = element.attrs;
        const dataTypeAttribute = attributes.find((m) => m.name === parserConfiguration.modularContentElementData.dataType);
        const resolvedDataAttribute = attributes.find((m) => m.name === parserConfiguration.resolvedLinkedItemAttribute);
        // process linked itmes
        if (dataTypeAttribute && !resolvedDataAttribute) {
            // get type of resolving item
            let type;
            if (dataTypeAttribute.value === 'item') {
                type = RichTextItemDataType.Item;
                // get codename of the modular content
                const dataCodenameAttribute = attributes.find((m) => m.name === parserConfiguration.modularContentElementData.dataCodename);
                if (dataCodenameAttribute == null) {
                    throw Error(`The '${parserConfiguration.modularContentElementData.dataCodename}' attribute is missing and therefore linked item cannot be retrieved`);
                }
                const itemCodename = dataCodenameAttribute.value;
                let itemType = 'linkedItem';
                // get rel attribute for components
                const relAttribute = attributes.find((m) => m.name === parserConfiguration.modularContentElementData.relAttribute);
                if (relAttribute && relAttribute.value === parserConfiguration.modularContentElementData.componentRel) {
                    itemType = 'component';
                }
                const linkedItem = {
                    dataCodename: dataCodenameAttribute ? dataCodenameAttribute.value : '',
                    dataType: dataTypeAttribute ? dataTypeAttribute.value : '',
                    itemType: itemType
                };
                // add to result
                result.linkedItems.push(linkedItem);
                const linkedItemHtml = replacement.getLinkedItemHtml(itemCodename, type);
                // flag element as resolved to avoid duplicate resolving
                element.attrs.push({
                    name: parserConfiguration.resolvedLinkedItemAttribute,
                    value: '1'
                });
                // add index to resolved item (can be useful for identifying linked item and may be used in WebSpotlight)
                element.attrs.push({
                    name: parserConfiguration.resolvedLinkedItemIndexAttribute,
                    value: linkedItemIndex.index.toString()
                });
                // increment index
                linkedItemIndex.increment();
                // get html
                const resultHtml = this.resolveRichTextElement(itemCodename, linkedItemHtml, elementName, replacement, config, linkedItemIndex).resolvedHtml;
                // replace 'object' tag name
                element.tagName = config.linkedItemWrapperTag;
                // add classes
                element.attrs.push({
                    name: 'class',
                    value: config.linkedItemWrapperClasses.map((m) => m).join(' ')
                });
                // get serialized set of nodes from HTML
                const serializedChildNodes = parseFragment(resultHtml);
                // add child nodes
                element.childNodes = serializedChildNodes.childNodes;
            }
            else {
                if (config.enableAdvancedLogging) {
                    console.warn(`Rich text element contains object with unsupported data type '${dataTypeAttribute.value}'`);
                }
            }
        }
    }
    getChildNodes(documentFragment) {
        return documentFragment.childNodes;
    }
}
//# sourceMappingURL=parse5-rich-text.parser.js.map