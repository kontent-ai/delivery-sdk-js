import { enumHelper } from '@kentico/kontent-core';

import { IDeliveryClientConfig } from '../config';
import { ElementContracts } from '../data-contracts';
import { ElementModels, Elements, ElementType } from '../elements';
import {
    IContentItem,
    IContentItemsContainer,
    IMapElementsResult,
    ILink,
    IRichTextImage,
    IContentItemWithRawDataContainer,
    IContentItemWithRawElements
} from '../models';

export class ElementMapper {
    constructor(private readonly config: IDeliveryClientConfig) {}

    mapElements<TContentItem extends IContentItem = IContentItem>(data: {
        dataToMap: IContentItemWithRawElements;
        processedItems: IContentItemsContainer;
        processingStartedForCodenames: string[];
        preparedItems: IContentItemWithRawDataContainer;
    }): IMapElementsResult<TContentItem> | undefined {
        // return processed item if possible (to avoid infinite recursion)
        const processedItem = data.processedItems[data.dataToMap.item.system.codename] as TContentItem;
        if (processedItem) {
            // item was already resolved, return it
            return {
                item: processedItem,
                processedItems: data.processedItems,
                preparedItems: data.preparedItems,
                processingStartedForCodenames: data.processingStartedForCodenames
            };
        }

        const elementCodenames = Object.getOwnPropertyNames(data.dataToMap.rawItem.elements);
        const preparedItem = data.preparedItems[data.dataToMap.item.system.codename];
        const itemInstance = preparedItem?.item as TContentItem;

        if (!itemInstance) {
            // item is not present in response, no need to do any mapping
            return undefined;
        }

        elementCodenames.forEach((elementCodename) => {
            const elementMap = this.resolveElementMap(itemInstance, elementCodename);
            const elementWrapper: ElementModels.IElementWrapper = {
                system: data.dataToMap.item.system,
                rawElement: data.dataToMap.rawItem.elements[elementCodename],
                element: elementMap.resolvedName
            };
            if (elementMap.shouldMapElement) {
                const mappedElement = this.mapElement({
                    elementWrapper: elementWrapper,
                    item: itemInstance,
                    preparedItems: data.preparedItems,
                    processingStartedForCodenames: data.processingStartedForCodenames,
                    processedItems: data.processedItems,
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
        item: IContentItem;
        processedItems: IContentItemsContainer;
        processingStartedForCodenames: string[];
        preparedItems: IContentItemWithRawDataContainer;
    }): ElementModels.IElement<any> {
        const elementType = enumHelper.getEnumFromValue<ElementType>(ElementType, data.elementWrapper.rawElement.type);
        if (elementType) {
            if (elementType === ElementType.ModularContent) {
                return this.mapLinkedItemsElement({
                    elementWrapper: data.elementWrapper,
                    preparedItems: data.preparedItems,
                    processingStartedForCodenames: data.processingStartedForCodenames,
                    processedItems: data.processedItems,
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
                    data.elementWrapper,
                    data.processedItems,
                    data.processingStartedForCodenames,
                    data.preparedItems
                );
            }

            if (elementType === ElementType.UrlSlug) {
                return this.mapUrlSlugElement(data.elementWrapper);
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
        elementWrapper: ElementModels.IElementWrapper,
        processedItems: IContentItemsContainer,
        processingStartedForCodenames: string[],
        preparedItems: IContentItemWithRawDataContainer
    ): Elements.IRichTextElement {
        // get all linked items nested in rich text
        const richTextLinkedItems: IContentItem[] = [];

        const rawElement = elementWrapper.rawElement as ElementContracts.IRichTextElementContract;

        if (rawElement.modular_content) {
            if (Array.isArray(rawElement.modular_content)) {
                rawElement.modular_content.forEach((codename) => {
                    // get linked item and check if it exists (it might not be included in response due to 'Depth' parameter)
                    const preparedData = preparedItems[codename];

                    // first try to get existing item
                    const existingLinkedItem = this.getOrSaveLinkedItemForElement(
                        codename,
                        rawElement,
                        processedItems,
                        processingStartedForCodenames,
                        preparedItems
                    );

                    if (existingLinkedItem) {
                        // item was found, add it to linked items
                        richTextLinkedItems.push(existingLinkedItem);
                    } else {
                        // item was not found or not yet resolved
                        if (preparedData) {
                            const mappedLinkedItemResult = this.mapElements({
                                dataToMap: preparedData,
                                preparedItems: preparedItems,
                                processingStartedForCodenames: processingStartedForCodenames,
                                processedItems: processedItems,
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
        const links: ILink[] = this.mapRichTextLinks(rawElement.links);
        const images: IRichTextImage[] = this.mapRichTextImages(rawElement.images);

        return {
            images: images,
            linkedItemCodenames: rawElement.modular_content,
            links: links,
            name: rawElement.name,
            type: ElementType.RichText,
            value: rawElement.value
        };
    }

    private mapDateTimeElement(elementWrapper: ElementModels.IElementWrapper): Elements.IDateTimeElement {
        return this.buildElement(elementWrapper, ElementType.DateTime, () =>
            elementWrapper.rawElement.value ? new Date(elementWrapper.rawElement.value) : null
        );
    }

    private mapMultipleChoiceElement(elementWrapper: ElementModels.IElementWrapper): Elements.IMultipleChoiceElement {
        return this.buildElement(elementWrapper, ElementType.MultipleChoice, () => elementWrapper.rawElement.value);
    }

    private mapNumberElement(elementWrapper: ElementModels.IElementWrapper): Elements.INumberElement {
        return this.buildElement(elementWrapper, ElementType.Number, () => {
            if (elementWrapper.rawElement.value === 0) {
                return 0;
            } else if (elementWrapper.rawElement.value) {
                return +elementWrapper.rawElement.value;
            }
            return null;
        });
    }

    private mapTextElement(elementWrapper: ElementModels.IElementWrapper): Elements.ITextElement {
        return this.buildElement(elementWrapper, ElementType.Text, () => elementWrapper.rawElement.value);
    }

    private mapAssetsElement(elementWrapper: ElementModels.IElementWrapper): Elements.IAssetsElement {
        return this.buildElement(elementWrapper, ElementType.Asset, () => elementWrapper.rawElement.value);
    }

    private mapTaxonomyElement(elementWrapper: ElementModels.IElementWrapper): Elements.ITaxonomyElement {
        return {
            ...this.buildElement(elementWrapper, ElementType.Taxonomy, () => elementWrapper.rawElement.value),
            taxonomyGroup: elementWrapper.rawElement.taxonomy_group
        };
    }

    private mapUnknowElement(elementWrapper: ElementModels.IElementWrapper): Elements.IUnknownElement {
        return this.buildElement(elementWrapper, ElementType.Unknown, () => elementWrapper.rawElement.value);
    }

    private mapCustomElement(
        elementWrapper: ElementModels.IElementWrapper
    ): Elements.ICustomElement | ElementModels.IElement<string> {
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
    ): Elements.IUrlSlugElement {
        return this.buildElement(elementWrapper, ElementType.UrlSlug, () => elementWrapper.rawElement.value);
    }

    private mapLinkedItemsElement(data: {
        elementWrapper: ElementModels.IElementWrapper;
        processedItems: IContentItemsContainer;
        processingStartedForCodenames: string[];
        preparedItems: IContentItemWithRawDataContainer;
    }): Elements.ILinkedItemsElement<any> {
        // prepare linked items
        const linkedItems: IContentItem[] = [];

        // value = array of item codenames
        const linkedItemCodenames = data.elementWrapper.rawElement.value as string[];
        linkedItemCodenames.forEach((codename) => {
            const linkedItem = this.getOrSaveLinkedItemForElement(
                codename,
                data.elementWrapper.rawElement,
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
            ...this.buildElement(data.elementWrapper, ElementType.ModularContent, () => linkedItemCodenames),
            linkedItems: linkedItems
        };
    }

    private getOrSaveLinkedItemForElement(
        codename: string,
        element: ElementContracts.IElementContract,
        processedItems: IContentItemsContainer,
        mappingStartedForCodenames: string[],
        preparedItems: IContentItemWithRawDataContainer
    ): IContentItem | undefined {
        // first check if item was already resolved and return it if it was
        const processedItem = processedItems[codename];

        if (processedItem) {
            // item was already resolved
            return processedItem;
        }

        const preparedItem = preparedItems[codename];

        if (mappingStartedForCodenames.includes(codename)) {
            return preparedItem?.item;
        }

        mappingStartedForCodenames.push(codename);

        // throw error if item is not in response and errors are not skipped
        if (!preparedItem) {
            return undefined;
        }

        let mappedLinkedItem: IContentItem | undefined;

        // original resolving if item is still undefined
        const mappedLinkedItemResult = this.mapElements({
            dataToMap: preparedItem,
            preparedItems: preparedItems,
            processingStartedForCodenames: mappingStartedForCodenames,
            processedItems: processedItems,
        });

        if (mappedLinkedItemResult) {
            mappedLinkedItem = mappedLinkedItemResult.item;

            // add to processed items
            processedItems[codename] = mappedLinkedItem;
        }

        return mappedLinkedItem;
    }

    private mapRichTextLinks(linksJson: ElementContracts.IRichTextElementLinkWrapperContract): ILink[] {
        const links: ILink[] = [];

        for (const linkId of Object.keys(linksJson)) {
            const linkRaw = linksJson[linkId];
            links.push({
                codename: linkRaw.codename,
                linkId: linkId,
                urlSlug: linkRaw.url_slug,
                type: linkRaw.type
            });
        }

        return links;
    }

    private mapRichTextImages(imagesJson: ElementContracts.IRichTextElementImageWrapperContract): IRichTextImage[] {
        const images: IRichTextImage[] = [];

        for (const imageId of Object.keys(imagesJson)) {
            const imageRaw = imagesJson[imageId];
            images.push({
                description: imageRaw.description,
                imageId: imageRaw.image_id,
                url: imageRaw.url,
                height: imageRaw.height,
                width: imageRaw.width
            });
        }

        return images;
    }

    private resolveElementMap(
        item: IContentItem,
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
            type: type,
            value: valueFactory()
        };
    }
}
