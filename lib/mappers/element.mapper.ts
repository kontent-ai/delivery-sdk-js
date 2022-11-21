import { enumHelper } from '@kontent-ai/core-sdk';
import { deliveryUrlHelper } from '../utilities';

import { IDeliveryClientConfig } from '../config';
import { Contracts } from '../contracts';
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

interface IRichTextImageUrlRecord {
    originalUrl: string;
    newUrl: string;
}

export class ElementMapper {
    constructor(private readonly config: IDeliveryClientConfig) {}

    mapElements<TContentItem extends IContentItem = IContentItem>(data: {
        dataToMap: IContentItemWithRawElements;
        processedItems: IContentItemsContainer;
        processingStartedForCodenames: string[];
        preparedItems: IContentItemWithRawDataContainer;
    }): IMapElementsResult<TContentItem> | undefined {
        // return processed item to avoid infinite recursion
        const processedItem = data.processedItems[data.dataToMap.item.system.codename] as TContentItem | undefined;
        if (processedItem) {
            // item was already resolved
            return {
                item: processedItem,
                processedItems: data.processedItems,
                preparedItems: data.preparedItems,
                processingStartedForCodenames: data.processingStartedForCodenames
            };
        }

        const preparedItem = data.preparedItems[data.dataToMap.item.system.codename];
        const itemInstance = preparedItem?.item as TContentItem;

        if (!itemInstance) {
            // item is not present in response
            return undefined;
        }

        // mapp elements
        const elementCodenames = Object.getOwnPropertyNames(data.dataToMap.rawItem.elements);

        for (const elementCodename of elementCodenames) {
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
                    processedItems: data.processedItems
                });

                // set mapped elements
                itemInstance.elements[elementMap.resolvedName] = mappedElement;
            }
        }

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
                    processedItems: data.processedItems
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
                // add to parent items
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
    ): Elements.RichTextElement {
        const rawElement = elementWrapper.rawElement as Contracts.IRichTextElementContract;

        // get all linked items and linked items codenames nested in rich text
        const richTextLinkedItems: IContentItem[] = [];
        const richTextLinkedItemsCodenames: string[] = [];

        // The Kontent Delivery API is not guaranteed to return rich-text modular_content array items in the same order in which they appear inside the `value` property.
        // We extract the modular_content codenames in the rich-text value and sort the raw modular_content based on that order instead.
        const rawModularContentCodenamesMatches = (rawElement.value as string).matchAll(
            /<object[^>]+data-codename=\"(?<codename>[a-z0-9_]*)\".*?>/g
        );
        const rawModularContentCodenamesSorted = Array.from(rawModularContentCodenamesMatches).reduce<string[]>(
            (acc, match) => {
                if (match.groups && match.groups.codename) {
                    acc.push(match.groups.codename);
                }
                return acc;
            },
            [] as string[]
        );
        const rawModularContentCodenames = [...rawElement.modular_content].sort(function (a, b) {
            return rawModularContentCodenamesSorted.indexOf(a) - rawModularContentCodenamesSorted.indexOf(b);
        });

        for (const codename of rawModularContentCodenames) {
            richTextLinkedItemsCodenames.push(codename);
            // get linked item and check if it exists (it might not be included in response due to 'Depth' parameter)
            const preparedData = preparedItems[codename];

            // first try to get existing item
            if (this.canMapLinkedItems()) {
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
                            processedItems: processedItems
                        });

                        // add mapped linked item to result
                        if (mappedLinkedItemResult) {
                            richTextLinkedItems.push(mappedLinkedItemResult.item);
                        }
                    }
                }
            }
        }

        // get rich text images
        const richTextImagesResult = this.getRichTextImages(rawElement.images);

        // extract and map links & images
        const links: ILink[] = this.mapRichTextLinks(rawElement.links);
        const images: IRichTextImage[] = richTextImagesResult.richTextImages;

        // replace asset urls in html
        const richTextHtml: string = this.getRichTextHtml(rawElement.value, richTextImagesResult.imageUrlRecords);

        return {
            images: images,
            linkedItemCodenames: richTextLinkedItemsCodenames,
            linkedItems: richTextLinkedItems,
            links: links,
            name: rawElement.name,
            type: ElementType.RichText,
            value: richTextHtml
        };
    }

    private mapDateTimeElement(elementWrapper: ElementModels.IElementWrapper): Elements.DateTimeElement {
        const rawElement = elementWrapper.rawElement as Contracts.IDateTimeElementContract;
        return {
            ...this.buildElement(elementWrapper, ElementType.DateTime, () => rawElement.value),
            displayTimeZone: rawElement.display_timezone ?? null
        };
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
        return this.buildElement(elementWrapper, ElementType.Asset, () => {
            const assetContracts = elementWrapper.rawElement.value as Contracts.IAssetContract[];

            const assets: ElementModels.AssetModel[] = [];

            for (const assetContract of assetContracts) {
                let renditions: { [renditionPresetCodename: string]: ElementModels.Rendition } | null = null;

                // get asset url (custom domain may be configured)
                const assetUrl: string = this.config.assetsDomain
                    ? deliveryUrlHelper.replaceAssetDomain(assetContract.url, this.config.assetsDomain)
                    : assetContract.url;

                if (assetContract.renditions) {
                    renditions = {};

                    for (const renditionPresetKey of Object.keys(assetContract.renditions)) {
                        const rendition = assetContract.renditions[renditionPresetKey];

                        renditions[renditionPresetKey] = {
                            ...rendition,
                            url: `${assetUrl}?${rendition.query}` // enhance rendition with absolute url
                        };
                    }
                }

                const renditionToBeApplied: ElementModels.Rendition | null =
                    (this.config.defaultRenditionPreset && renditions?.[this.config.defaultRenditionPreset]) || null;

                const finalUrl = renditionToBeApplied?.url ?? assetUrl;

                const asset: ElementModels.AssetModel = {
                    ...assetContract,
                    url: finalUrl, // use custom url of asset which may contain custom domain and applied rendition
                    renditions
                };

                assets.push(asset);
            }

            return assets;
        });
    }

    private mapTaxonomyElement(elementWrapper: ElementModels.IElementWrapper): Elements.TaxonomyElement {
        return {
            ...this.buildElement(elementWrapper, ElementType.Taxonomy, () => elementWrapper.rawElement.value),
            taxonomyGroup: elementWrapper.rawElement.taxonomy_group ?? null
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

    private mapUrlSlugElement(elementWrapper: ElementModels.IElementWrapper): Elements.UrlSlugElement {
        return this.buildElement(elementWrapper, ElementType.UrlSlug, () => elementWrapper.rawElement.value);
    }

    private mapLinkedItemsElement(data: {
        elementWrapper: ElementModels.IElementWrapper;
        processedItems: IContentItemsContainer;
        processingStartedForCodenames: string[];
        preparedItems: IContentItemWithRawDataContainer;
    }): Elements.LinkedItemsElement<any> {
        // prepare linked items
        const linkedItems: IContentItem[] = [];

        // value = array of item codenames
        const linkedItemCodenames = data.elementWrapper.rawElement.value as string[];

        for (const codename of linkedItemCodenames) {
            if (this.canMapLinkedItems()) {
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
                }
            }
        }

        return {
            ...this.buildElement(data.elementWrapper, ElementType.ModularContent, () => linkedItemCodenames),
            linkedItems: linkedItems
        };
    }

    private getOrSaveLinkedItemForElement(
        codename: string,
        element: Contracts.IElementContract,
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
            processedItems: processedItems
        });

        if (mappedLinkedItemResult) {
            mappedLinkedItem = mappedLinkedItemResult.item;

            // add to processed items
            processedItems[codename] = mappedLinkedItem;
        }

        return mappedLinkedItem;
    }

    private mapRichTextLinks(linksJson: Contracts.IRichTextElementLinkWrapperContract): ILink[] {
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

    private getRichTextHtml(richTextHtml: string, richTextImageRecords: IRichTextImageUrlRecord[]): string {
        for (const richTextImageRecord of richTextImageRecords) {
            // replace rich text image url if it differs
            if (richTextImageRecord.newUrl !== richTextImageRecord.originalUrl) {
                richTextHtml = richTextHtml.replace(
                    new RegExp(richTextImageRecord.originalUrl, 'g'),
                    richTextImageRecord.newUrl
                );
            }
        }

        return richTextHtml;
    }

    private getRichTextImages(imagesJson: Contracts.IRichTextElementImageWrapperContract): {
        richTextImages: IRichTextImage[];
        imageUrlRecords: IRichTextImageUrlRecord[];
    } {
        const images: IRichTextImage[] = [];
        const imageUrlRecords: IRichTextImageUrlRecord[] = [];

        for (const imageId of Object.keys(imagesJson)) {
            const imageRaw = imagesJson[imageId];

            // image may contain custom asset domain
            const imageUrl: string = this.config.assetsDomain
                ? deliveryUrlHelper.replaceAssetDomain(imageRaw.url, this.config.assetsDomain)
                : imageRaw.url;

            images.push({
                description: imageRaw.description ?? null,
                imageId: imageRaw.image_id,
                url: imageUrl,
                height: imageRaw.height ?? null,
                width: imageRaw.width ?? null
            });

            imageUrlRecords.push({
                originalUrl: imageRaw.url,
                newUrl: imageUrl
            });
        }

        return {
            imageUrlRecords: imageUrlRecords,
            richTextImages: images
        };
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

    private canMapLinkedItems(): boolean {
        if (!this.config.linkedItemsReferenceHandler) {
            return true;
        }
        return this.config.linkedItemsReferenceHandler === 'map';
    }
}
