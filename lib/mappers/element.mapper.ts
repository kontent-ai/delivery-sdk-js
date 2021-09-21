import { enumHelper } from '@kentico/kontent-core';

import { IDeliveryClientConfig } from '../config';
import { ElementContracts, ItemContracts } from '../data-contracts';
import { ElementModels, Elements, ElementType } from '../elements';
import {
    IContentItem,
    IContentItemsContainer,
    IItemQueryConfig,
    IMapElementsResult,
    Link,
    RichTextImage
} from '../models';

export class ElementMapper {
    constructor(private readonly config: IDeliveryClientConfig) {}

    mapElements<TContentItem extends IContentItem<any> = IContentItem<any>>(data: {
        item: ItemContracts.IContentItemContract;
        queryConfig: IItemQueryConfig;
        processedItems: IContentItemsContainer;
        processingStartedForCodenames: string[];
        preparedItems: IContentItemsContainer;
    }): IMapElementsResult<TContentItem> | undefined {
        // return processed item if possible (to avoid infinite recursion)
        const processedItem = data.processedItems[data.item.system.codename] as TContentItem;
        if (processedItem) {
            // item was already resolved, return it
            return {
                item: processedItem,
                processedItems: data.processedItems,
                preparedItems: data.preparedItems,
                processingStartedForCodenames: data.processingStartedForCodenames
            };
        }

        const elementCodenames = Object.getOwnPropertyNames(data.item.elements);
        const itemInstance = data.preparedItems[data.item.system.codename] as TContentItem;

        if (!itemInstance) {
            // item is not present in response, no need to do any mapping
            return undefined;
        }

        elementCodenames.forEach((elementCodename) => {
            const elementMap = this.resolveElementMap(itemInstance, elementCodename);
            const elementWrapper: ElementModels.IElementWrapper = {
                system: data.item.system,
                rawElement: data.item.elements[elementCodename],
                element: elementMap.resolvedName
            };
            if (elementMap.shouldMapElement) {
                const mappedElement = this.mapElement({
                    elementWrapper: elementWrapper,
                    item: itemInstance,
                    preparedItems: data.preparedItems,
                    processingStartedForCodenames: data.processingStartedForCodenames,
                    processedItems: data.processedItems,
                    queryConfig: data.queryConfig
                });

                // set mapped elements
                itemInstance.elements[elementMap.resolvedName] = mappedElement;
            }
        });

        return {
            item: itemInstance,
            processedItems: data.processedItems,
            preparedItems: data.preparedItems,
            processingStartedForCodenames: data.processingStartedForCodenames
        };
    }

    private mapElement(data: {
        elementWrapper: ElementModels.IElementWrapper;
        item: IContentItem<any>;
        queryConfig: IItemQueryConfig;
        processedItems: IContentItemsContainer;
        processingStartedForCodenames: string[];
        preparedItems: IContentItemsContainer;
    }): ElementModels.IElement<any> {
        const elementType = enumHelper.getEnumFromValue<ElementType>(ElementType, data.elementWrapper.rawElement.type);
        if (elementType) {
            if (elementType === ElementType.ModularContent) {
                return this.mapLinkedItemsElement({
                    elementWrapper: data.elementWrapper,
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
                return this.mapRichTextElement(
                    data.item,
                    data.elementWrapper,
                    data.queryConfig,
                    data.processedItems,
                    data.processingStartedForCodenames,
                    data.preparedItems
                );
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
        console.warn(
            `Could not map element '${data.elementWrapper.rawElement.name}' of type '${data.elementWrapper.rawElement.type}'. Returning unknown element instead.`
        );
        return this.mapUnknowElement(data.elementWrapper);
    }

    private mapRichTextElement(
        item: IContentItem<any>,
        elementWrapper: ElementModels.IElementWrapper,
        queryConfig: IItemQueryConfig,
        processedItems: IContentItemsContainer,
        processingStartedForCodenames: string[],
        preparedItems: IContentItemsContainer
    ): Elements.RichTextElement {
        // get all linked items nested in rich text
        const richTextLinkedItems: IContentItem<any>[] = [];

        const rawElement = elementWrapper.rawElement as ElementContracts.IRichTextElementContract;

        if (rawElement.modular_content) {
            if (Array.isArray(rawElement.modular_content)) {
                rawElement.modular_content.forEach((codename) => {
                    // get linked item and check if it exists (it might not be included in response due to 'Depth' parameter)
                    const preparedItem = preparedItems[codename];

                    // first try to get existing item
                    const existingLinkedItem = this.getOrSaveLinkedItemForElement(
                        codename,
                        rawElement,
                        queryConfig,
                        processedItems,
                        processingStartedForCodenames,
                        preparedItems
                    );

                    if (existingLinkedItem) {
                        // item was found, add it to linked items
                        richTextLinkedItems.push(existingLinkedItem);
                    } else {
                        let throwErrorForMissingLinkedItems = false;

                        // check if errors should be thrown for missing linked items
                        if (
                            queryConfig.throwErrorForMissingLinkedItems === false ||
                            queryConfig.throwErrorForMissingLinkedItems === true
                        ) {
                            // variable is a boolean
                            throwErrorForMissingLinkedItems = queryConfig.throwErrorForMissingLinkedItems;
                        }

                        // throw error if raw item is not available and errors are not skipped
                        if (!preparedItem) {
                            const msg = `Mapping RichTextElement element '${rawElement.name}' failed because referenced linked item with codename '${codename}' could not be found in Delivery response.
                            Increasing 'depth' parameter may solve this issue as it will include nested items. Alternatively you may disable 'throwErrorForMissingLinkedItems' in your query`;

                            if (throwErrorForMissingLinkedItems) {
                                throw Error(msg);
                            }
                        }

                        // item was not found or not yet resolved
                        if (preparedItem) {
                            const mappedLinkedItemResult = this.mapElements({
                                item: preparedItem._raw,
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

        return {
            images: images,
            linkedItemCodenames: rawElement.modular_content,
            links: links,
            name: rawElement.name,
            rawData: rawElement,
            type: ElementType.RichText,
            value: rawElement.value
        };
    }

    private mapDateTimeElement(elementWrapper: ElementModels.IElementWrapper): Elements.DateTimeElement {
        return this.buildElement(elementWrapper, ElementType.DateTime, () =>
            elementWrapper.rawElement.value ? new Date(elementWrapper.rawElement.value) : null
        );
    }

    private mapMultipleChoiceElement(elementWrapper: ElementModels.IElementWrapper): Elements.MultipleChoiceElement {
        return this.buildElement(elementWrapper, ElementType.MultipleChoice, () => elementWrapper.rawElement.value);
    }

    private mapNumberElement(elementWrapper: ElementModels.IElementWrapper): Elements.NumberElement {
        return this.buildElement(elementWrapper, ElementType.Number, () => {
            if (elementWrapper.rawElement.value === 0) {
                return 0;
            } else if (elementWrapper.rawElement.value) {
                return +elementWrapper.rawElement.value;
            }
            return null;
        });
    }

    private mapTextElement(elementWrapper: ElementModels.IElementWrapper): Elements.TextElement {
        return this.buildElement(elementWrapper, ElementType.Text, () => elementWrapper.rawElement.value);
    }

    private mapAssetsElement(elementWrapper: ElementModels.IElementWrapper): Elements.AssetsElement {
        return this.buildElement(elementWrapper, ElementType.Asset, () => elementWrapper.rawElement.value);
    }

    private mapTaxonomyElement(elementWrapper: ElementModels.IElementWrapper): Elements.TaxonomyElement {
        return {
            ...this.buildElement(elementWrapper, ElementType.Taxonomy, () => elementWrapper.rawElement.value),
            taxonomyGroup: elementWrapper.rawElement.taxonomy_group
        };
    }

    private mapUnknowElement(elementWrapper: ElementModels.IElementWrapper): Elements.UnknownElement {
        return this.buildElement(elementWrapper, ElementType.Unknown, () => elementWrapper.rawElement.value);
    }

    private mapCustomElement(
        elementWrapper: ElementModels.IElementWrapper
    ): Elements.CustomElement | ElementModels.IElement<string> {
        // try to find element resolver
        if (this.config.elementResolver) {
            const elementResolverValue = this.config.elementResolver(elementWrapper);

            if (elementResolverValue) {
                return this.buildElement(elementWrapper, ElementType.Custom, () => elementResolverValue);
            }
        }

        return this.buildElement(elementWrapper, ElementType.Custom, () => elementWrapper.rawElement.value);
    }

    private mapUrlSlugElement(
        elementWrapper: ElementModels.IElementWrapper,
        item: IContentItem<any>,
        queryConfig: IItemQueryConfig
    ): Elements.UrlSlugElement {
        return this.buildElement(elementWrapper, ElementType.UrlSlug, () => elementWrapper.rawElement.value);
    }

    private mapLinkedItemsElement(data: {
        elementWrapper: ElementModels.IElementWrapper;
        queryConfig: IItemQueryConfig;
        processedItems: IContentItemsContainer;
        processingStartedForCodenames: string[];
        preparedItems: IContentItemsContainer;
    }): Elements.LinkedItemsElement<any> {
        // prepare linked items
        const linkedItems: IContentItem<any>[] = [];

        // value = array of item codenames
        const linkedItemCodenames = data.elementWrapper.rawElement.value as string[];
        linkedItemCodenames.forEach((codename) => {
            const linkedItem = this.getOrSaveLinkedItemForElement(
                codename,
                data.elementWrapper.rawElement,
                data.queryConfig,
                data.processedItems,
                data.processingStartedForCodenames,
                data.preparedItems
            );
            if (linkedItem) {
                // add item to result
                linkedItems.push(linkedItem);
            } else {
                // item was not found
                console.warn(
                    `Linked item with codename '${codename}' in linked items element '${data.elementWrapper.rawElement.name}' of '${data.elementWrapper.rawElement.type}' type could not be found. If you require this item, consider increasing 'depth' of your query. This warning can be turned off by disabling 'enableAdvancedLogging' option.`
                );
            }
        });

        return {
            ...this.buildElement(
                data.elementWrapper,
                ElementType.ModularContent,
                () => data.elementWrapper.rawElement.value
            ),
            linkedItems: linkedItems,
            itemCodenames: linkedItemCodenames
        };
    }

    private getOrSaveLinkedItemForElement(
        codename: string,
        element: ElementContracts.IElementContract,
        queryConfig: IItemQueryConfig,
        processedItems: IContentItemsContainer,
        mappingStartedForCodenames: string[],
        preparedItems: IContentItemsContainer
    ): IContentItem<any> | undefined {
        // first check if item was already resolved and return it if it was
        const processedItem = processedItems[codename];

        if (processedItem) {
            // item was already resolved
            return processedItem;
        }

        const preparedItem = preparedItems[codename];

        if (mappingStartedForCodenames.includes(codename)) {
            return preparedItem;
        }

        mappingStartedForCodenames.push(codename);

        // by default errors are not thrown
        const throwErrorForMissingLinkedItems: boolean =
            queryConfig.throwErrorForMissingLinkedItems === true ? true : false;

        // throw error if item is not in response and errors are not skipped
        if (!preparedItem) {
            if (throwErrorForMissingLinkedItems) {
                throw Error(`Linked item with codename '${codename}' could not be found in Delivery response.
                This linked item was requested by '${element.name}' element of '${element.type}'.
                Error can usually be solved by increasing 'Depth' parameter of your query.
                Alternatively, you may prevent this error by disabling 'throwErrorForMissingLinkedItems' in query configuration.`);
            }

            return undefined;
        }

        let mappedLinkedItem: IContentItem<any> | undefined;

        // original resolving if item is still undefined
        const mappedLinkedItemResult = this.mapElements({
            item: preparedItem._raw,
            preparedItems: preparedItems,
            processingStartedForCodenames: mappingStartedForCodenames,
            processedItems: processedItems,
            queryConfig: queryConfig
        });

        if (mappedLinkedItemResult) {
            mappedLinkedItem = mappedLinkedItemResult.item;

            // add to processed items
            processedItems[codename] = mappedLinkedItem;
        }

        return mappedLinkedItem;
    }

    private mapRichTextLinks(linksJson: ElementContracts.IRichTextElementLinkWrapperContract): Link[] {
        const links: Link[] = [];

        for (const linkId of Object.keys(linksJson)) {
            const linkRaw = linksJson[linkId];
            links.push(
                new Link({
                    codename: linkRaw.codename,
                    linkId: linkId,
                    urlSlug: linkRaw.url_slug,
                    type: linkRaw.type
                })
            );
        }

        return links;
    }

    private mapRichTextImages(imagesJson: ElementContracts.IRichTextElementImageWrapperContract): RichTextImage[] {
        const images: RichTextImage[] = [];

        for (const imageId of Object.keys(imagesJson)) {
            const imageRaw = imagesJson[imageId];
            images.push(
                new RichTextImage({
                    description: imageRaw.description,
                    imageId: imageRaw.image_id,
                    url: imageRaw.url,
                    height: imageRaw.height,
                    width: imageRaw.width
                })
            );
        }

        return images;
    }

    private resolveElementMap(
        item: IContentItem<any>,
        originalElementCodename: string
    ): {
        shouldMapElement: boolean;
        resolvedName: string;
    } {
        let resolvedElementPropertyName: string | undefined = undefined;

        if (this.config.propertyNameResolver) {
            resolvedElementPropertyName = this.config.propertyNameResolver(item.system.type, originalElementCodename);
        }

        if (!resolvedElementPropertyName) {
            // use original element codename
            resolvedElementPropertyName = originalElementCodename;
        }

        return {
            resolvedName: resolvedElementPropertyName,
            shouldMapElement: true
        };
    }

    private buildElement<TValue>(
        elementWrapper: ElementModels.IElementWrapper,
        type: ElementType,
        valueFactory: () => TValue
    ): ElementModels.IElement<TValue> {
        return {
            name: elementWrapper.rawElement.name,
            rawData: elementWrapper.rawElement,
            type: type,
            value: valueFactory()
        };
    }
}
