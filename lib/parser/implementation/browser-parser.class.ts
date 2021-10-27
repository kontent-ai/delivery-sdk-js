import {
    IParsedObjects,
    IImageObject,
    ILinkedItemContentObject,
    ILinkObject,
    ParsedItemIndexReferenceWrapper,
    IParser,
    IParseResolvers,
    IParserResult
} from '../parse-models';
import { parserConfiguration } from '../parser-configuration';
import { ContentItemType, IContentItem } from '../../models';
import { parserHelper } from '../parser.helper';
import { Elements } from '../../elements';

export class BrowserParser implements IParser<string> {
    parse(
        html: string,
        mainRichTextElement: Elements.RichTextElement,
        resolvers: IParseResolvers,
        linkedItems: IContentItem[]
    ): IParserResult<string> {
        return this.parseInternal(
            mainRichTextElement,
            resolvers,
            html,
            linkedItems,
            new ParsedItemIndexReferenceWrapper(0),
            null
        );
    }

    private parseInternal(
        mainRichTextElement: Elements.RichTextElement,
        resolvers: IParseResolvers,
        html: string,
        linkedItems: IContentItem[],
        linkedItemIndex: ParsedItemIndexReferenceWrapper,
        parentElement: Element | null
    ): IParserResult<string> {
        const rootElement = this.createWrapperElement(html);

        // get all linked items
        const result = this.processRichTextElement(
            mainRichTextElement,
            resolvers,
            rootElement.children,
            {
                links: [],
                linkedItems: [],
                images: []
            },
            linkedItems,
            linkedItemIndex,
            parentElement
        );

        return {
            componentCodenames: result.linkedItems.filter((m) => m.itemType === 'component').map((m) => m.dataCodename),
            linkedItemCodenames: result.linkedItems
                .filter((m) => m.itemType === 'linkedItem')
                .map((m) => m.dataCodename),
            result: rootElement.innerHTML
        };
    }

    private processRichTextElement(
        mainRichTextElement: Elements.RichTextElement,
        resolvers: IParseResolvers,
        htmlCollection: HTMLCollection,
        result: IParsedObjects,
        linkedItems: IContentItem[],
        linkedItemIndex: ParsedItemIndexReferenceWrapper,
        parentElement: Element | null
    ): IParsedObjects {
        if (!htmlCollection || htmlCollection.length === 0) {
            // there are no more nodes
        } else {
            // extract objects
            for (let i = 0; i < htmlCollection.length; i++) {
                const element = htmlCollection[i];

                resolvers.elementResolver(parserHelper.convertToParserElement(element));

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

                    const elementParent = element.parentElement;

                    if (!elementParent) {
                        console.warn(
                            `Could not replace linked item '${linkItemContentObject.dataCodename}' of '${linkItemContentObject.dataType}' because parent node is undefined. Please report this error if you are seeing this.`
                        );
                    } else {
                        if (dataTypeAttribute.value === 'item') {
                            // add to result
                            result.linkedItems.push(linkItemContentObject);

                            // resolve linked item
                            resolvers.contentItemResolver(
                                parserHelper.convertToParserElement(element),
                                linkItemContentObject.dataCodename,
                                linkedItemIndex.index,
                                parserHelper.getLinkedItem(linkedItems, linkItemContentObject.dataCodename)
                            );

                            // increment index
                            linkedItemIndex.increment();
                        } else {
                            console.warn(
                                `Rich text element contains object with unsupported data type '${dataTypeAttribute.value}'`
                            );
                        }
                    }
                }
                // process links
                else if (
                    element.nodeName.toLowerCase() === parserConfiguration.linkElementData.nodeName.toLowerCase()
                ) {
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

                        resolvers.urlResolver(
                            parserHelper.convertToParserElement(element),
                            linkObject.dataItemId,
                            linkText,
                            parserHelper.tryGetLink(mainRichTextElement, linkedItems, linkObject.dataItemId)
                        );
                    }
                }
                // process images
                else if (
                    element.nodeName.toLowerCase() === parserConfiguration.imageElementData.nodeName.toLowerCase()
                ) {
                    const dataImageIdAttribute = element.attributes.getNamedItem(
                        parserConfiguration.imageElementData.dataImageId
                    );

                    // continue only if data image id is present. There could be regular img tags included
                    if (dataImageIdAttribute) {
                        const imageObj: IImageObject = {
                            imageId: dataImageIdAttribute.value
                        };

                        result.images.push(imageObj);

                        // resolve image
                        resolvers.imageResolver(
                            parserHelper.convertToParserElement(element),
                            imageObj.imageId,
                            parserHelper.tryGetImage(mainRichTextElement, linkedItems, imageObj.imageId)
                        );
                    }
                } else {
                    // process generic elements
                    resolvers.genericElementResolver(parserHelper.convertToParserElement(element));
                }

                // recursively process child nodes
                if (element.children && element.children.length > 0) {
                    this.processRichTextElement(
                        mainRichTextElement,
                        resolvers,
                        element.children,
                        result,
                        linkedItems,
                        linkedItemIndex,
                        parentElement
                    );
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
}

export const browserParser = new BrowserParser();
