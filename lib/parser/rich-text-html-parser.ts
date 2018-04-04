import {
    IFeaturedObjects,
    IHtmlResolverConfig,
    ILinkObject,
    IModularContentObject,
    IRichTextHtmlParser,
    IRichTextReplacements,
    IRichTextResolverResult,
} from './parse-models';

export class RichTextHtmlParser implements IRichTextHtmlParser {

    private readonly modularContent = {
        type: 'application/kenticocloud',
        dataType: 'data-type',
        dataCodename: 'data-codename'
    }

    private readonly link = {
        nodeName: 'a',
        dataItemId: 'data-item-id',
    }

    resolveRichTextField(html: string, replacement: IRichTextReplacements, config: IHtmlResolverConfig): IRichTextResolverResult {
        try {
            const doc = this.createWrapperElement(html);

            // get all modular content items
            const result = this.processRichTextField(doc.childNodes, replacement, config, {
                links: [],
                modularContentItems: []
            });

            return {
                links: result.links,
                modularContentItems: result.modularContentItems,
                resolvedHtml: doc.innerHTML
            }

        } catch (error) {
            throw Error('Parsing HTML failed:' + error);
        }
    };

    private createWrapperElement(html: string): HTMLDivElement {
        const element = document.createElement('div');
        element.innerHTML = html;

        return element;
    }

    private processRichTextField(nodeList: NodeList, replacement: IRichTextReplacements, config: IHtmlResolverConfig, result: IFeaturedObjects): IFeaturedObjects {
        if (!nodeList || nodeList.length === 0) {
            // there are no more nodes
        } else {
            // extract objects
            for (let i = 0; i < nodeList.length; i++) {
                const node = nodeList[i];
                const typeAttribute = node.attributes ? node.attributes.getNamedItem('type') : undefined;

                if (typeAttribute && typeAttribute.value && typeAttribute.value.toLowerCase() === this.modularContent.type.toLowerCase()) {
                    // node is modular content object
                    const modularItem: IModularContentObject = {
                        node: node,
                        dataCodename: node.attributes.getNamedItem(this.modularContent.dataCodename).value,
                        dataType: node.attributes.getNamedItem(this.modularContent.dataType).value
                    };

                    // add to result
                    result.modularContentItems.push(modularItem);

                    // replace html
                    const parentNode = node.parentNode;
                    if (!parentNode) {
                        console.warn(`Could not replace modular content '${modularItem.dataCodename}' of '${modularItem.dataType}' because parent node is null. Please report this error if you are seeing this.`);
                    } else {
                        // remove object node
                        parentNode.removeChild(node);

                        // create new element
                        const newElem = document.createElement('p');
                        newElem.innerHTML = replacement.getModularContentHtml(modularItem.dataCodename);

                        // replace object node with resolved content
                        parentNode.appendChild(newElem);
                    }
                }

                if (node.nodeName.toLowerCase() === this.link.nodeName.toLowerCase()) {
                    const dataItemIdAttribute = node.attributes.getNamedItem(this.link.dataItemId);
                    if (dataItemIdAttribute) {
                        const link: ILinkObject = {
                            node: node,
                            dataItemId: node.attributes.getNamedItem(this.link.dataItemId).value
                        };

                        // add to result
                        result.links.push(link);

                        const resolvedUrl = replacement.getLinkUrl(link.dataItemId);

                        // add url to link
                        const hrefAttribute = node.attributes.getNamedItem('href');
                        if (!hrefAttribute) {
                            // href attribute is missing
                            if (config.enableAdvancedLogging) {
                                console.warn(`Cannot set url '${resolvedUrl}' because 'href' attribute is not present in the <a> tag. Please report this issue if you are seeing this.`)
                            }
                        } else {
                            hrefAttribute.value = resolvedUrl;
                        }
                    }
                }

                // recursively process child nodes
                if (node.childNodes && node.childNodes.length > 0) {
                    this.processRichTextField(node.childNodes, replacement, config, result);
                }
            }
        }

        return result;
    }
}

