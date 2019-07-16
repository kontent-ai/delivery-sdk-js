import { enumHelper } from 'kentico-cloud-core';

import { defaultCollissionResolver, IDeliveryClientConfig } from '../config';
import { ElementContracts, ItemContracts } from '../data-contracts';
import { ElementDecorators, ElementModels, Elements, ElementType } from '../elements';
import { IContentItem, IItemQueryConfig } from '../interfaces';
import {
    ContentItem,
    ElementCollisionResolver,
    IContentItemsContainer,
    ItemLinkResolver,
    Link,
    RichTextImage,
} from '../models';
import { IRichTextHtmlParser } from '../parser/parse-models';
import { richTextResolver, stronglyTypedResolver, urlSlugResolver } from '../resolvers';

export interface IMapElementsResult<TItem extends IContentItem = IContentItem> {
    item: TItem;
    processedItems: IContentItemsContainer;
    preparedItems: IContentItemsContainer;
    processingStartedForCodenames: string[];
}

export class ElementMapper {

    private readonly defaultLinkedItemWrapperTag: string = 'p';
    private readonly defaultLinkedItemWrapperClasses: string[] = ['kc-linked-item-wrapper'];

    constructor(
        private readonly config: IDeliveryClientConfig,
        private readonly richTextHtmlParser: IRichTextHtmlParser
    ) {
    }

    /**
     * Maps all element in given content item and returns strongly typed content item based on the resolver specified
     * in DeliveryClientConfig
     */
    mapElements<TItem extends IContentItem = IContentItem>(data: {
        item: ItemContracts.IContentItemContract,
        modularContent: ItemContracts.IModularContentWrapperContract,
        queryConfig: IItemQueryConfig,
        processedItems: IContentItemsContainer,
        processingStartedForCodenames: string[],
        preparedItems: IContentItemsContainer
    }): IMapElementsResult<TItem> {
        // return processed item if possible (to avoid infinite recursion)
        const processedItem = this.getProcessedItem(data.item.system.codename, data.processedItems);
        if (processedItem) {
            // item was already resolved, return it
            return {
                item: processedItem as TItem,
                processedItems: data.processedItems,
                preparedItems: data.preparedItems,
                processingStartedForCodenames: data.processingStartedForCodenames
            };
        }

        const elementCodenames = Object.getOwnPropertyNames(data.item.elements);

        const itemInstance = stronglyTypedResolver.createItemInstance<TItem>(
            data.item.system.type,
            {
                item: data.item,
                modularContent: data.modularContent
            },
            this.config.typeResolvers || []);

        if (!data.preparedItems) {
            data.preparedItems = <IContentItemsContainer>{};
        }

        // add to prepared items
        data.preparedItems[data.item.system.codename] = itemInstance;

        elementCodenames.forEach(elementCodename => {
            if (!itemInstance) {
                throw Error(`Item instance was not initiazed correctly.`);
            }

            const elementMap = this.resolveElementMap(itemInstance, elementCodename);
            const elementWrapper: ElementModels.IElementWrapper = {
                contentTypeSystem: data.item.system,
                rawElement: data.item.elements[elementCodename],
                propertyName: elementMap.resolvedName,
            };

            if (elementMap.shouldMapElement) {
                const mappedElement = this.mapElement({
                    elementWrapper: elementWrapper,
                    item: itemInstance,
                    modularContent: data.modularContent,
                    preparedItems: data.preparedItems,
                    processingStartedForCodenames: data.processingStartedForCodenames,
                    processedItems: data.processedItems,
                    queryConfig: data.queryConfig
                });

                // set mapped element to item instance
                (itemInstance as IContentItem)[elementMap.resolvedName] = mappedElement;
            }
        });

        return {
            item: itemInstance,
            processedItems: data.processedItems,
            preparedItems: data.preparedItems,
            processingStartedForCodenames: data.processingStartedForCodenames
        };
    }

    private mapElement(
        data: {
            elementWrapper: ElementModels.IElementWrapper,
            modularContent: ItemContracts.IModularContentWrapperContract,
            item: IContentItem,
            queryConfig: IItemQueryConfig,
            processedItems: IContentItemsContainer,
            processingStartedForCodenames: string[],
            preparedItems: IContentItemsContainer
        }): undefined | ElementModels.IElement<any> | IContentItem[] {
        const elementType = enumHelper.getEnumFromValue<ElementType>(ElementType, data.elementWrapper.rawElement.type);
        if (elementType) {

            if (elementType === ElementType.ModularContent) {
                return this.mapLinkedItemsElement({
                    elementWrapper: data.elementWrapper,
                    modularContent: data.modularContent,
                    preparedItems: data.preparedItems,
                    processingStartedForCodenames: data.processingStartedForCodenames,
                    processedItems: data.processedItems,
                    queryConfig: data.queryConfig
                });
            }

            if (elementType === ElementType.Text) {
                return this.mapTextElement(data.elementWrapper);
            }
            if (elementType === ElementType.Asset) {
                return this.mapAssetsElement(data.elementWrapper);
            }

            if (elementType === ElementType.Number) {
                return this.mapNumberElement(data.elementWrapper);
            }
            if (elementType === ElementType.MultipleChoice) {
                return this.mapMultipleChoiceElement(data.elementWrapper);
            }

            if (elementType === ElementType.DateTime) {
                return this.mapDateTimeElement(data.elementWrapper);
            }

            if (elementType === ElementType.RichText) {
                return this.mapRichTextElement(data.item, data.elementWrapper, data.modularContent, data.queryConfig, data.processedItems, data.processingStartedForCodenames, data.preparedItems);
            }

            if (elementType === ElementType.UrlSlug) {
                return this.mapUrlSlugElement(data.elementWrapper, data.item, data.queryConfig);
            }

            if (elementType === ElementType.Taxonomy) {
                return this.mapTaxonomyElement(data.elementWrapper);
            }

            if (elementType === ElementType.Custom) {
                return this.mapCustomElement(data.elementWrapper);
            }
        }
        console.warn(`Skipping unknown element type '${data.elementWrapper.rawElement.type}' of element '${data.elementWrapper.rawElement.name}'`);
        return undefined;
    }

    private mapRichTextElement(
        item: IContentItem,
        elementWrapper: ElementModels.IElementWrapper,
        modularContent: ItemContracts.IModularContentWrapperContract,
        queryConfig: IItemQueryConfig,
        processedItems: IContentItemsContainer,
        processingStartedForCodenames: string[],
        preparedItems: IContentItemsContainer): Elements.RichTextElement {

        // get all linked items nested in rich text
        const richTextLinkedItems: IContentItem[] = [];

        const rawElement = elementWrapper.rawElement as ElementContracts.IRichTextElementContract;

        if (rawElement.modular_content) {
            if (Array.isArray(rawElement.modular_content)) {
                rawElement.modular_content.forEach(codename => {
                    // get linked item and check if it exists (it might not be included in response due to 'Depth' parameter)
                    const rawItem = modularContent[codename] as ItemContracts.IContentItemContract | undefined;

                    // first try to get existing item
                    const existingLinkedItem = this.getOrSaveLinkedItemForElement(codename, rawElement, queryConfig, modularContent, processedItems, processingStartedForCodenames, preparedItems);

                    if (existingLinkedItem) {
                        // item was found, add it to linked items
                        richTextLinkedItems.push(existingLinkedItem);
                    } else {
                        let throwErrorForMissingLinkedItems = false;

                        // check if errors should be thrown for missing linked items
                        if (queryConfig.throwErrorForMissingLinkedItems === false || queryConfig.throwErrorForMissingLinkedItems === true) {
                            // variable is a boolean
                            throwErrorForMissingLinkedItems = queryConfig.throwErrorForMissingLinkedItems;
                        }

                        // throw error if raw item is not available and errors are not skipped
                        if (!rawItem) {
                            const msg = `Mapping RichTextElement element '${rawElement.name}' failed because referenced linked item with codename '${codename}' could not be found in Delivery response.
                            Increasing 'depth' parameter may solve this issue as it will include nested items. Alternatively you may disable 'throwErrorForMissingLinkedItems' in your query`;

                            if (throwErrorForMissingLinkedItems) {
                                throw Error(msg);
                            }
                        }

                        // item was not found or not yet resolved
                        if (rawItem) {
                            const mappedLinkedItemResult = this.mapElements({
                                item: rawItem,
                                modularContent: modularContent,
                                preparedItems: preparedItems,
                                processingStartedForCodenames: processingStartedForCodenames,
                                processedItems: processedItems,
                                queryConfig: queryConfig
                            });

                            // add mapped linked item to result
                            if (mappedLinkedItemResult) {
                                richTextLinkedItems.push(mappedLinkedItemResult.item);
                            }
                        }
                    }
                });
            }
        }

        // extract and map links & images
        const links: Link[] = this.mapRichTextLinks(rawElement.links);
        const images: RichTextImage[] = this.mapRichTextImages(rawElement.images);

        return new Elements.RichTextElement(
            elementWrapper,
            rawElement.modular_content,
            {
                links: links,
                resolveHtmlFunc: () => richTextResolver.resolveHtml(item.system.codename, rawElement.value, elementWrapper.propertyName, {
                    enableAdvancedLogging: this.config.enableAdvancedLogging ? this.config.enableAdvancedLogging : false,
                    images: images,
                    richTextHtmlParser: this.richTextHtmlParser,
                    getLinkedItem: (codename) => this.getOrSaveLinkedItemForElement(codename, rawElement, queryConfig, modularContent, processedItems, processingStartedForCodenames, preparedItems),
                    links: links,
                    queryConfig: queryConfig,
                    linkedItemWrapperTag: this.config.linkedItemResolver && this.config.linkedItemResolver.linkedItemWrapperTag
                        ? this.config.linkedItemResolver.linkedItemWrapperTag
                        : this.defaultLinkedItemWrapperTag,
                    linkedItemWrapperClasses: this.config.linkedItemResolver && this.config.linkedItemResolver.linkedItemWrapperClasses
                        ? this.config.linkedItemResolver.linkedItemWrapperClasses
                        : this.defaultLinkedItemWrapperClasses,
                }),
                images: images
            });
    }

    private mapDateTimeElement(elementWrapper: ElementModels.IElementWrapper): Elements.DateTimeElement {
        return new Elements.DateTimeElement(elementWrapper);
    }

    private mapMultipleChoiceElement(elementWrapper: ElementModels.IElementWrapper): Elements.MultipleChoiceElement {
        return new Elements.MultipleChoiceElement(elementWrapper);
    }

    private mapNumberElement(elementWrapper: ElementModels.IElementWrapper): Elements.NumberElement {
        return new Elements.NumberElement(elementWrapper);
    }

    private mapTextElement(elementWrapper: ElementModels.IElementWrapper): Elements.TextElement {
        return new Elements.TextElement(elementWrapper);
    }

    private mapAssetsElement(elementWrapper: ElementModels.IElementWrapper): Elements.AssetsElement {
        return new Elements.AssetsElement(elementWrapper);
    }

    private mapTaxonomyElement(elementWrapper: ElementModels.IElementWrapper): Elements.TaxonomyElement {
        return new Elements.TaxonomyElement(elementWrapper);
    }

    private mapCustomElement(elementWrapper: ElementModels.IElementWrapper): Elements.DefaultCustomElement | ElementModels.IElement<string> {
        // try to find element resolver
        if (this.config.elementResolver) {
            const customElementClass = this.config.elementResolver(elementWrapper);

            if (customElementClass) {
                return customElementClass;
            }

        }
        return new Elements.DefaultCustomElement(elementWrapper);
    }

    private mapUrlSlugElement(elementWrapper: ElementModels.IElementWrapper, item: IContentItem, queryConfig: IItemQueryConfig): Elements.UrlSlugElement {
        const linkResolver = this.getLinkResolverForUrlSlugElement(item, queryConfig);
        return new Elements.UrlSlugElement(
            elementWrapper,
            {
                resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                    elementName: elementWrapper.propertyName,
                    elementValue: elementWrapper.rawElement.value,
                    item: item,
                    enableAdvancedLogging: this.config.enableAdvancedLogging ? this.config.enableAdvancedLogging : false,
                    linkResolver: linkResolver
                })
            });
    }

    private mapLinkedItemsElement(data: {
        elementWrapper: ElementModels.IElementWrapper,
        modularContent: ItemContracts.IModularContentWrapperContract,
        queryConfig: IItemQueryConfig,
        processedItems: IContentItemsContainer,
        processingStartedForCodenames: string[],
        preparedItems: IContentItemsContainer
    }
    ): ContentItem[] {
        if (!data.elementWrapper) {
            if (this.config.enableAdvancedLogging) {
                console.warn(`Cannot map linked item element because element does not exist. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
            }
            return [];
        }

        if (!data.elementWrapper.rawElement.value) {
            if (this.config.enableAdvancedLogging) {
                console.warn(`Cannot map linked item of '${data.elementWrapper.rawElement.name}' because its value does not exist. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
            }
            return [];
        }

        // result is always an array of content items
        const result: IContentItem[] = [];

        // value = array of item codenames
        const linkedItemCodenames = data.elementWrapper.rawElement.value as string[];
        linkedItemCodenames.forEach(codename => {
            const linkedItem = this.getOrSaveLinkedItemForElement(codename, data.elementWrapper.rawElement, data.queryConfig, data.modularContent, data.processedItems, data.processingStartedForCodenames, data.preparedItems);
            if (linkedItem) {
                // add item to result
                result.push(linkedItem);
            } else {
                // item was not found
                if (this.config.enableAdvancedLogging) {
                    // tslint:disable-next-line:max-line-length
                    console.warn(`Linked item with codename '${codename}' in linked items element '${data.elementWrapper.rawElement.name}' of '${data.elementWrapper.rawElement.type}' type could not be found. If you require this item, consider increasing 'depth' of your query. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
                }
            }
        });

        return result;
    }

    private getLinkResolverForUrlSlugElement(item: IContentItem, queryConfig: IItemQueryConfig): ItemLinkResolver | undefined {
        // link resolver defined by the query config (= by calling method) has priority over type's global link resolver
        let linkResolver: ItemLinkResolver | undefined = undefined;

        if (queryConfig.linkResolver) {
            linkResolver = queryConfig.linkResolver;
        } else {
            linkResolver = item.linkResolver;
        }

        return linkResolver;
    }

    private getProcessedItem(codename: string, processedItems: IContentItemsContainer): IContentItem | undefined {
        return processedItems[codename];
    }

    private getPreparedItem(codename: string, preparedItems: IContentItemsContainer): IContentItem | undefined {
        return preparedItems[codename];
    }

    private getOrSaveLinkedItemForElement(
        codename: string,
        element: ElementContracts.IElementContract,
        queryConfig: IItemQueryConfig,
        modularContent: ItemContracts.IModularContentWrapperContract,
        processedItems: IContentItemsContainer,
        mappingStartedForCodenames: string[],
        preparedItems: IContentItemsContainer): IContentItem | undefined {
        // first check if item was already resolved and return it if it was
        const processedItem = this.getProcessedItem(codename, processedItems);

        if (processedItem) {
            // item was already resolved
            return processedItem;
        }

        if (mappingStartedForCodenames.find(m => m === codename)) {
            // item was already processed, but may not have yet been resolved (e.g. when child references parent)
            // return reference to prepared item
            return preparedItems[codename];
        }

        mappingStartedForCodenames.push(codename);

        // try getting item from modular content
        const rawItem = modularContent[codename] as ItemContracts.IContentItemContract | undefined;

        // if not found item might not be a linked item, but can still be in standard response
        // (e.g. when linked item references item in standard response)
        if (!rawItem) {
            const preparedItem = this.getPreparedItem(codename, preparedItems);
            if (preparedItem) {
                return preparedItem;
            }
        }

        // by default errors are not thrown
        let throwErrorForMissingLinkedItems: boolean = false;

        // check if errors should be thrown for missing linked items
        if (queryConfig.throwErrorForMissingLinkedItems === false || queryConfig.throwErrorForMissingLinkedItems === true) {
            // variable is a boolean
            throwErrorForMissingLinkedItems = queryConfig.throwErrorForMissingLinkedItems;
        }

        // throw error if item is not in response and errors are not skipped
        if (!rawItem) {
            if (throwErrorForMissingLinkedItems) {
                throw Error(`Linked item with codename '${codename}' could not be found in Delivery response.
                This linked item was requested by '${element.name}' element of '${element.type}'.
                Error can usually be solved by increasing 'Depth' parameter of your query.
                Alternatively, you may prevent this error by disabling 'throwErrorForMissingLinkedItems' in query configuration.`);
            }

            return undefined;
        }

        let mappedLinkedItem: IContentItem | undefined;

        // try resolving item using custom item resolver if its set
        if (queryConfig.itemResolver) {
            const customMappedItem = queryConfig.itemResolver(element, rawItem, modularContent, queryConfig);

            if (customMappedItem) {
                // if user used custom mapping, make sure to add 'system' and 'elements' properties to result
                customMappedItem.system = stronglyTypedResolver.mapSystemAttributes(rawItem.system);
                customMappedItem.elements = rawItem.elements;
                mappedLinkedItem = customMappedItem;
            }
        }

        // original resolving if item is still undefined
        if (!mappedLinkedItem) {
            const mappedLinkedItemResult = this.mapElements(
                {
                    item: rawItem,
                    modularContent: modularContent,
                    preparedItems: preparedItems,
                    processingStartedForCodenames: mappingStartedForCodenames,
                    processedItems: processedItems,
                    queryConfig: queryConfig
                });

            mappedLinkedItem = mappedLinkedItemResult.item;
        }

        // add to processed items
        processedItems[codename] = mappedLinkedItem;
        return mappedLinkedItem;
    }

    private mapRichTextLinks(linksJson: ElementContracts.IRichTextElementLinkWrapperContract): Link[] {
        const links: Link[] = [];

        for (const linkId of Object.keys(linksJson)) {
            const linkRaw = linksJson[linkId];
            links.push(new Link({
                codename: linkRaw.codename,
                linkId: linkId,
                urlSlug: linkRaw.url_slug,
                type: linkRaw.type,
            }));
        }

        return links;
    }

    private mapRichTextImages(imagesJson: ElementContracts.IRichTextElementImageWrapperContract): RichTextImage[] {
        const images: RichTextImage[] = [];

        for (const imageId of Object.keys(imagesJson)) {
            const imageRaw = imagesJson[imageId];
            images.push(new RichTextImage({
                description: imageRaw.description,
                imageId: imageRaw.image_id,
                url: imageRaw.url,
                height: imageRaw.height,
                width: imageRaw.width
            }));
        }

        return images;
    }

    private resolveElementMap(item: IContentItem, originalElementCodename: string): {
        shouldMapElement: boolean,
        resolvedName: string
    } {
        let resolvedElementPropertyName: string | undefined = undefined;

        // resolve using property resolver
        if (item.propertyResolver) {
            resolvedElementPropertyName = item.propertyResolver(originalElementCodename);
        }

        // if property hasn't been resolved, try getting name using decorator
        if (resolvedElementPropertyName === originalElementCodename || !resolvedElementPropertyName) {
            resolvedElementPropertyName = ElementDecorators.getPropertyName(item, originalElementCodename);
        }

        if (!resolvedElementPropertyName) {
            // use original element codename
            resolvedElementPropertyName = originalElementCodename;
        }

        // check for collissions
        if (this.collidesWithAnotherProperty(resolvedElementPropertyName, item)) {
            // try to resolve collission using dedicated resolver
            const collisionResolver = this.getCollisionResolver();
            resolvedElementPropertyName = collisionResolver(resolvedElementPropertyName);

            // verify again if the new element collides
            if (this.collidesWithAnotherProperty(resolvedElementPropertyName, item)) {
                console.warn(`Element '${resolvedElementPropertyName}' collides with another element in same type. Element mapping is skipped. Source item: '${item.system.codename}'`);
                return {
                    shouldMapElement: false,
                    resolvedName: ''
                };
            }
        }

        return {
            resolvedName: resolvedElementPropertyName,
            shouldMapElement: true
        };
    }

    private getCollisionResolver(): ElementCollisionResolver {
        return this.config.collisionResolver ? this.config.collisionResolver : defaultCollissionResolver;
    }

    private collidesWithAnotherProperty(elementName: string, item: IContentItem): boolean {
        return item[elementName] ? true : false;
    }
}
