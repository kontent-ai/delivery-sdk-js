import {
    IFeaturedObjects,
    IHtmlResolverConfig,
    ILinkObject,
    IModularContentObject,
    IRichTextHtmlParser,
    IRichTextReplacements,
    IRichTextResolverResult,
} from '../lib/parser';

export class RichTextHtmlParser implements IRichTextHtmlParser {

    private readonly modularContentWrapperElem = 'div';

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
            const doc = this.createWrapperElement(html);

            // get all modular content items
            const result = this.processRichTextField(doc.children, replacement, config, {
                links: [],
                modularContentItems: []
            });

            return {
                links: result.links,
                modularContentItems: result.modularContentItems,
                resolvedHtml: doc.innerHTML
            };

        } catch (error) {
            throw Error('Parsing HTML failed:' + error);
        }
    }

    private createWrapperElement(html: string): HTMLDivElement {
        const element = document.createElement(this.modularContentWrapperElem);
        element.innerHTML = html;

        return element;
    }

    private processRichTextField(htmlCollection: HTMLCollection, replacement: IRichTextReplacements, config: IHtmlResolverConfig, result: IFeaturedObjects): IFeaturedObjects {
        if (!htmlCollection || htmlCollection.length === 0) {
            // there are no more nodes
        } else {
            // extract objects
            for (let i = 0; i < htmlCollection.length; i++) {
                const element = htmlCollection[i];
                const typeAttribute = element.attributes ? element.attributes.getNamedItem('type') : undefined;
                if (element.attributes && typeAttribute && typeAttribute.value && typeAttribute.value.toLowerCase() === this.modularContent.type.toLowerCase()) {
                    // node is modular content object
                    const dataCodenameAttribute = element.attributes.getNamedItem(this.modularContent.dataCodename);
                    const dataTypeAttribute = element.attributes.getNamedItem(this.modularContent.dataType);

                    const modularItem: IModularContentObject = {
                        dataCodename: dataCodenameAttribute ? dataCodenameAttribute.value : '',
                        dataType: dataTypeAttribute ? dataTypeAttribute.value : ''
                    };

                    // add to result
                    result.modularContentItems.push(modularItem);

                    // replace html
                    const parentElement = element.parentElement;

                    if (!parentElement) {
                        console.warn(`Could not replace modular content '${modularItem.dataCodename}' of '${modularItem.dataType}' because parent node is null. Please report this error if you are seeing this.`);
                    } else {
                        // create new element
                        const newElem = document.createElement(config.modularContentWrapperTag);
                        newElem.innerHTML = replacement.getModularContentHtml(modularItem.dataCodename);

                        // add classes
                        newElem.className = config.modularContentWrapperClasses.map(m => m).join(', ');

                        // remove original object element
                        parentElement.replaceChild(newElem, element);
                    }
                }

                if (element.nodeName.toLowerCase() === this.link.nodeName.toLowerCase()) {
                    const dataItemIdAttribute = element.attributes.getNamedItem(this.link.dataItemId);

                    if (dataItemIdAttribute) {
                        const link: ILinkObject = {
                            dataItemId: dataItemIdAttribute ? dataItemIdAttribute.value : ''
                        };

                        // add to result
                        result.links.push(link);

                        const resolvedUrl = replacement.getLinkUrl(link.dataItemId);

                        // add url to link
                        const hrefAttribute = element.attributes.getNamedItem('href');
                        if (!hrefAttribute) {
                            // href attribute is missing
                            if (config.enableAdvancedLogging) {
                                console.warn(`Cannot set url '${resolvedUrl}' because 'href' attribute is not present in the <a> tag. Please report this issue if you are seeing this.`);
                            }
                        } else {
                            hrefAttribute.value = resolvedUrl;
                        }
                    }
                }

                // recursively process child nodes
                if (element.children && element.children.length > 0) {
                    this.processRichTextField(element.children, replacement, config, result);
                }
            }
        }

        return result;
    }
}

