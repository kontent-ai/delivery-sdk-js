
import {
    IFeaturedObjects,
    IHtmlResolverConfig,
    ILinkObject,
    IModularContentObject,
    IRichTextHtmlParser,
    IRichTextReplacements,
    IRichTextResolverResult,
} from '../parse-models';

import * as parse5 from 'parse5/lib';
import { AST } from 'parse5/lib';

export class Parse5RichTextParser implements IRichTextHtmlParser {

    private readonly modularContent = {
        type: 'application/kenticocloud',
        dataType: 'data-type',
        dataCodename: 'data-codename'
    };

    private readonly link = {
        nodeName: 'a',
        dataItemId: 'data-item-id',
    };

    resolveRichTextField(html: string, replacement: IRichTextReplacements, config: IHtmlResolverConfig): IRichTextResolverResult {
        try {
            // create document
            const documentFragment = parse5.parseFragment(html) as AST.DocumentFragment;

            // get all modular content items
            const result = this.processRichTextField(this.getChildNodes(documentFragment), replacement, config, {
                links: [],
                modularContentItems: []
            });

            const resolvedHtml = parse5.serialize(documentFragment);

            return {
                links: result.links,
                modularContentItems: result.modularContentItems,
                resolvedHtml: resolvedHtml
            };

        } catch (error) {
            throw Error('Parsing HTML failed:' + error);
        }
    }

    private processRichTextField(elements: AST.Default.Element[], replacement: IRichTextReplacements, config: IHtmlResolverConfig, result: IFeaturedObjects): IFeaturedObjects {
        if (!elements || elements.length === 0) {
            // there are no more elements
        } else {
            elements.forEach(element => {
                if (element.attrs) {

                    // process modular content
                    this.processModularContent(element, replacement, config, result);

                    // process link
                    this.processLink(element, replacement, config, result);
                }

                if (element.childNodes) {
                    // recursively process all childs
                    this.processRichTextField(this.getChildNodes(element), replacement, config, result);
                }
            });
        }

        return result;
    }

    private processLink(element: AST.Default.Element, replacement: IRichTextReplacements, config: IHtmlResolverConfig, result: IFeaturedObjects): void {
        const attributes = element.attrs;

        if (element.nodeName !== this.link.nodeName) {
            // node is not a link
            return;
        }

        // get all links which have item it attribute, ignore all other links (they can be regular links in rich text)
        const dataItemIdAttribute = attributes.find(m => m.name === this.link.dataItemId);
        if (!dataItemIdAttribute) {
            // its either a regular link or the attribute is not defined
            return;
        }

        // get id of content item
        const itemId = dataItemIdAttribute.value;

        const link: ILinkObject = {
            dataItemId: dataItemIdAttribute ? dataItemIdAttribute.value : ''
        };

        // add to result
        result.links.push(link);

        const resolvedUrl = replacement.getLinkUrl(link.dataItemId);

        // assign url to 'href' attribute of the link
        const hrefAttribute = attributes.find(m => m.name === 'href');
        if (!hrefAttribute) {
            // href attribute is missing
            if (config.enableAdvancedLogging) {
                console.warn(`Cannot set url '${resolvedUrl}' because 'href' attribute is not present in the link element`);
            }
            return;
        }

        hrefAttribute.value = resolvedUrl;
    }

    private processModularContent(element: AST.Default.Element, replacement: IRichTextReplacements, config: IHtmlResolverConfig, result: IFeaturedObjects): void {
        const attributes = element.attrs;

        const dataTypeAttribute = attributes.find(m => m.value === this.modularContent.type);
        if (!dataTypeAttribute) {
            // node is not of modular content type
            return;
        }

        // get codename of the modular content
        const dataCodenameAttribute: AST.Default.Attribute | undefined = attributes.find(m => m.name === this.modularContent.dataCodename);
        if (dataCodenameAttribute == null) {
            throw Error(`The '${this.modularContent.dataCodename}' attribute is missing and therefore modular content item cannot be retrieved`);
        }

        const itemCodename = dataCodenameAttribute.value;

        const modularItem: IModularContentObject = {
            dataCodename: dataCodenameAttribute ? dataCodenameAttribute.value : '',
            dataType: dataTypeAttribute ? dataTypeAttribute.value : ''
        };

        // add to result
        result.modularContentItems.push(modularItem);

        // get html
        const resultHtml = replacement.getModularContentHtml(itemCodename);

        // replace 'object' tag name
        element.tagName = config.modularContentWrapperTag;

        // add classes
        element.attrs.push({
            name: 'class',
            value: config.modularContentWrapperClasses.map(m => m).join(' ')
        });

        // get serialized set of nodes from HTML
        const serializedChildNodes = parse5.parseFragment(resultHtml) as any;

        // add child nodes
        element.childNodes = serializedChildNodes.childNodes;
    }

    private getChildNodes(documentFragment: AST.DocumentFragment): AST.Default.Element[] {
        return (documentFragment as AST.Default.DocumentFragment).childNodes as AST.Default.Element[];
    }

}

