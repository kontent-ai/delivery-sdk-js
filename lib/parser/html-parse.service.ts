import {
    IFeaturedObjects,
    IHtmlResolverConfig,
    ILinkObject,
    IModularContentObject,
    IRichTextReplacements,
    IRichTextResolverResult,
} from './parse-models';
import { IContentItem } from '../interfaces/item/icontent-item.interface';

// tslint:disable-next-line:max-line-length
const testHtml = `<p>fehere he's ta here he's t ,</p><object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"tom_hardy\"></object>\n<object type=\"application/kenticocloud\" data-type=\"item\" data-codename=\"joel_edgerton\"></object>\n<p>See more in profile of <a data-item-id=\"3294e4b0-e58b-49d7-85fa-5bc9a86556ec\" href=\"\">Joel Edgerton</a> and <a data-item-id=\"d1557cb1-d7ec-4d04-9742-f86b52bc34fc\" href=\"\">Tom Hardy</a></p>`;

/**
 * DOM parser
 */
const parser = new DOMParser()

/**
 * Seriliazer to get String from XMLDocument
 */
const serializer = new XMLSerializer();

export class HtmlParseService {

    private readonly modularContent = {
        type: 'application/kenticocloud',
        dataType: 'data-type',
        dataCodename: 'data-codename'
    }

    private readonly link = {
        nodeName: 'a',
        dataItemId: 'data-item-id',
    }

    resolveRichTextField(replacement: IRichTextReplacements, config: IHtmlResolverConfig): IRichTextResolverResult {
        try {
            const doc = this.createDocument(testHtml);

            // get all modular content items
            const result = this.processRichTextField(doc.childNodes, replacement, {
                links: [],
                modularContentItems: []
            });

            return {
                links: result.links,
                modularContentItems: result.modularContentItems,
                resolvedHtml: serializer.serializeToString(doc)
            }

        } catch (error) {
            throw Error('Parsing HTML failed:' + error);
        }
    };

    /**
     * Converts an html characterSet into its original character.
     *
     * @param {String} html htmlSet entities
     **/
    private decodeHtmlEntities(html: string) {
        return html.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        })
    };

    private createDocument(html: string): HTMLDivElement {
        /*
        Requirements for successful parsing:
        - Html needs to be wrapped in one root element
        - All html entities need to be decoded
        - (Optional) line ending should be decoded
        */
        const htmlToParse = this.decodeHtmlEntities(this.replaceHtmlLines(`<root>${html}</root>`));
        const doc = new HTMLDocument();
        const element = doc.createElement('div');
        element.innerHTML = html;

        return element;

    }

    private replaceHtmlLines(html: string): string {
        return html.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

    private processRichTextField(nodeList: NodeList, replacement: IRichTextReplacements, result: IFeaturedObjects): IFeaturedObjects {
        if (!nodeList || nodeList.length === 0) {
            // there are no more nodes
        } else {
            // extract objects
            for (let i = 0; i < nodeList.length; i++) {
                const node = nodeList[i];
                const typeAttribute = node.attributes ? node.attributes.getNamedItem('type') : undefined;
                if (typeAttribute && typeAttribute.value && typeAttribute.value.toLowerCase() === this.modularContent.type) {
                    // node is modular content object
                    const modularItem: IModularContentObject = {
                        node: node,
                        dataCodename: node.attributes.getNamedItem(this.modularContent.dataCodename).value,
                        dataType: node.attributes.getNamedItem(this.modularContent.dataType).value
                    };

                    // add to result
                    result.modularContentItems.push(modularItem);

                    // replace
                }

                if (node.nodeName === this.link.nodeName) {
                    const dataItemIdAttribute = node.attributes.getNamedItem(this.link.dataItemId);

                    if (dataItemIdAttribute) {
                        const link: ILinkObject = {
                            node: node,
                            dataItemId: node.attributes.getNamedItem(this.link.dataItemId).value
                        };

                        // add to result
                        result.links.push(link);

                        // replace
                    }
                }

                // recursively process child nodes
                if (node.childNodes && node.childNodes.length > 0) {
                    this.processRichTextField(node.childNodes, replacement, result);
                }
            }
        }

        return result;
    }

    private processModularContent(modularContentObject: IModularContentObject, replacement: IRichTextReplacements, config: IHtmlResolverConfig): void {
        // get modular content item
        const modularContentItem = replacement.contentItems.find(m => m.system.codename === modularContentObject.dataCodename);

        // check if modular content really exists
        if (!modularContentItem) {
            throw Error(`Cannot resolve modular content in 'RichTextField' for '${ modularContentObject.dataCodename}' content item`);
        }

        // create new replacement object

        // get html to replace object using Rich text resolver function
        let resolver: (<TItem extends IContentItem>(item: TItem) => string) | null = null;
        if (config.queryConfig.richTextResolver) {
            // use resolved defined by query if available
            resolver = config.queryConfig.richTextResolver;
        } else {
            // use default resolver defined in models
            if (modularContentItem.richTextResolver) {
                resolver = modularContentItem.richTextResolver;
            }
        }

        // check resolver
        if (resolver == null) {
            if (config.enableAdvancedLogging) {
                console.warn(`Cannot resolve modular content of '${modularContentItem.system.type}' type in 'RichTextField' because no rich text resolved was configured`);
            }
        } else {
            const replaceHtml = resolver(modularContentItem);
            console.log('TO do - rich text');
            console.log(replaceHtml);
        }
    }

    private processLink(linkObject: ILinkObject, replacement: IRichTextReplacements, config: IHtmlResolverConfig): void {
        // find link with the id of content item
        const link = replacement.links.find(m => m.itemId === linkObject.dataItemId);

        if (!link) {
            if (config.enableAdvancedLogging) {
                console.warn(`Cannot resolve URL for item '${linkObject.dataItemId}' because no link with this id was found`);
            }
            return;
        }

        // try to resolve link using the resolver passed through the query config
        const queryLinkResolver = config.queryConfig.linkResolver;

        let url;

        if (queryLinkResolver) {
            // try to resolve url using the query config
            url = queryLinkResolver(link);
        }

        if (!url) {
            // url was not resolved, try to find global resolver for this particular type
            // and apply its url resolver

            const emptyTypeItem = config.typeResolverService.createEmptyTypedObj<IContentItem>(link.type);

            if (!emptyTypeItem) {
                throw Error(`Cannot resolve link for '${link.type}' type because mapping failed (have you registered this type in your config?)`);
            }

            const globalLinkResolver = emptyTypeItem.linkResolver;
            if (globalLinkResolver) {
                url = globalLinkResolver(link);
            }
        }

        // url still wasn't resolved
        if (!url) {
            if (config.enableAdvancedLogging) {
                console.warn(`Url for content type '${link.type}' with id '${link.itemId}' resolved to null/undefiend`);
            }
            return;
        }

        // assign url to 'href' attribute of the link
        const hrefAttribute = linkObject.node.attributes.getNamedItem('href');
        if (!hrefAttribute) {
            // href attribute is missing
            if (config.enableAdvancedLogging) {
                console.warn(`Cannot set url '${url}' because 'href' attribute is not present in the <a> tag`)
            }
            return;
        }

        hrefAttribute.value = url;
    }

}

export const htmlParseService = new HtmlParseService();
