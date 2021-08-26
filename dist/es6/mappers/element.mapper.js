import { enumHelper } from '@kentico/kontent-core';
import { defaultCollissionResolver } from '../config';
import { ElementDecorators, Elements, ElementType } from '../elements';
import { Link, RichTextImage, } from '../models';
import { richTextResolver, stronglyTypedResolver, urlSlugResolver } from '../resolvers';
export class ElementMapper {
    constructor(config, richTextHtmlParser) {
        this.config = config;
        this.richTextHtmlParser = richTextHtmlParser;
        this.defaultLinkedItemWrapperTag = 'p';
        this.defaultLinkedItemWrapperClasses = ['kc-linked-item-wrapper'];
    }
    /**
     * Maps all element in given content item and returns strongly typed content item based on the resolver specified
     * in DeliveryClientConfig
     */
    mapElements(data) {
        // return processed item if possible (to avoid infinite recursion)
        const processedItem = data.processedItems[data.item.system.codename];
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
        const itemInstance = data.preparedItems[data.item.system.codename];
        if (!itemInstance) {
            // item is not present in response, no need to do any mapping
            return undefined;
        }
        elementCodenames.forEach(elementCodename => {
            const elementMap = this.resolveElementMap(itemInstance, elementCodename);
            const elementWrapper = {
                contentItemSystem: data.item.system,
                rawElement: data.item.elements[elementCodename],
                propertyName: elementMap.resolvedName
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
                // set mapped element to item instance
                itemInstance[elementMap.resolvedName] = mappedElement;
            }
        });
        return {
            item: itemInstance,
            processedItems: data.processedItems,
            preparedItems: data.preparedItems,
            processingStartedForCodenames: data.processingStartedForCodenames
        };
    }
    mapElement(data) {
        const elementType = enumHelper.getEnumFromValue(ElementType, data.elementWrapper.rawElement.type);
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
                return this.mapRichTextElement(data.item, data.elementWrapper, data.queryConfig, data.processedItems, data.processingStartedForCodenames, data.preparedItems);
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
        console.warn(`Could not map element '${data.elementWrapper.rawElement.name}' of type '${data.elementWrapper.rawElement.type}'. Returning unknown element instead.`);
        return this.mapUnknowElement(data.elementWrapper);
    }
    mapRichTextElement(item, elementWrapper, queryConfig, processedItems, processingStartedForCodenames, preparedItems) {
        // get all linked items nested in rich text
        const richTextLinkedItems = [];
        const rawElement = elementWrapper.rawElement;
        if (rawElement.modular_content) {
            if (Array.isArray(rawElement.modular_content)) {
                rawElement.modular_content.forEach(codename => {
                    // get linked item and check if it exists (it might not be included in response due to 'Depth' parameter)
                    const preparedItem = preparedItems[codename];
                    // first try to get existing item
                    const existingLinkedItem = this.getOrSaveLinkedItemForElement(codename, rawElement, queryConfig, processedItems, processingStartedForCodenames, preparedItems);
                    if (existingLinkedItem) {
                        // item was found, add it to linked items
                        richTextLinkedItems.push(existingLinkedItem);
                    }
                    else {
                        let throwErrorForMissingLinkedItems = false;
                        // check if errors should be thrown for missing linked items
                        if (queryConfig.throwErrorForMissingLinkedItems === false ||
                            queryConfig.throwErrorForMissingLinkedItems === true) {
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
        const links = this.mapRichTextLinks(rawElement.links);
        const images = this.mapRichTextImages(rawElement.images);
        return new Elements.RichTextElement(elementWrapper, rawElement.modular_content, {
            links: links,
            resolveRichTextFunc: () => richTextResolver.resolveData(item.system.codename, rawElement.value, elementWrapper.propertyName, {
                enableAdvancedLogging: this.config.isDeveloperMode ? this.config.isDeveloperMode : false,
                getGlobalUrlSlugResolver: type => this.getGlobalUrlSlugResolverForType(type),
                images: images,
                richTextHtmlParser: this.richTextHtmlParser,
                getLinkedItem: codename => this.getOrSaveLinkedItemForElement(codename, rawElement, queryConfig, processedItems, processingStartedForCodenames, preparedItems),
                links: links,
                queryConfig: queryConfig,
                linkedItemWrapperTag: this.config.linkedItemResolver && this.config.linkedItemResolver.linkedItemWrapperTag
                    ? this.config.linkedItemResolver.linkedItemWrapperTag
                    : this.defaultLinkedItemWrapperTag,
                linkedItemWrapperClasses: this.config.linkedItemResolver && this.config.linkedItemResolver.linkedItemWrapperClasses
                    ? this.config.linkedItemResolver.linkedItemWrapperClasses
                    : this.defaultLinkedItemWrapperClasses
            }),
            images: images
        });
    }
    mapDateTimeElement(elementWrapper) {
        return new Elements.DateTimeElement(elementWrapper);
    }
    mapMultipleChoiceElement(elementWrapper) {
        return new Elements.MultipleChoiceElement(elementWrapper);
    }
    mapNumberElement(elementWrapper) {
        return new Elements.NumberElement(elementWrapper);
    }
    mapTextElement(elementWrapper) {
        return new Elements.TextElement(elementWrapper);
    }
    mapAssetsElement(elementWrapper) {
        return new Elements.AssetsElement(elementWrapper);
    }
    mapTaxonomyElement(elementWrapper) {
        return new Elements.TaxonomyElement(elementWrapper);
    }
    mapUnknowElement(elementWrapper) {
        return new Elements.UnknownElement(elementWrapper);
    }
    mapCustomElement(elementWrapper) {
        // try to find element resolver
        if (this.config.elementResolver) {
            const customElementClass = this.config.elementResolver(elementWrapper);
            if (customElementClass) {
                return customElementClass;
            }
        }
        return new Elements.DefaultCustomElement(elementWrapper);
    }
    mapUrlSlugElement(elementWrapper, item, queryConfig) {
        const resolver = this.getUrlSlugResolverForElement(item, elementWrapper, queryConfig);
        return new Elements.UrlSlugElement(elementWrapper, {
            resolveLinkFunc: () => urlSlugResolver.resolveUrl({
                elementName: elementWrapper.propertyName,
                elementValue: elementWrapper.rawElement.value,
                item: item,
                enableAdvancedLogging: this.config.isDeveloperMode ? this.config.isDeveloperMode : false,
                resolver: resolver
            }).url || ''
        });
    }
    mapLinkedItemsElement(data) {
        // prepare linked items
        const linkedItems = [];
        // value = array of item codenames
        const linkedItemCodenames = data.elementWrapper.rawElement.value;
        linkedItemCodenames.forEach(codename => {
            const linkedItem = this.getOrSaveLinkedItemForElement(codename, data.elementWrapper.rawElement, data.queryConfig, data.processedItems, data.processingStartedForCodenames, data.preparedItems);
            if (linkedItem) {
                // add item to result
                linkedItems.push(linkedItem);
            }
            else {
                // item was not found
                if (this.config.isDeveloperMode) {
                    // tslint:disable-next-line:max-line-length
                    console.warn(`Linked item with codename '${codename}' in linked items element '${data.elementWrapper.rawElement.name}' of '${data.elementWrapper.rawElement.type}' type could not be found. If you require this item, consider increasing 'depth' of your query. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
                }
            }
        });
        return new Elements.LinkedItemsElement(data.elementWrapper, linkedItems);
    }
    getUrlSlugResolverForElement(item, elementWrapper, queryConfig) {
        // query `urlSlugResolver` has priority over global resolver
        if (queryConfig.urlSlugResolver) {
            return queryConfig.urlSlugResolver;
        }
        if (item._config && item._config.urlSlugResolver) {
            return item._config.urlSlugResolver;
        }
        // resolve default link value
        return () => elementWrapper.rawElement.value;
    }
    getOrSaveLinkedItemForElement(codename, element, queryConfig, processedItems, mappingStartedForCodenames, preparedItems) {
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
        const throwErrorForMissingLinkedItems = queryConfig.throwErrorForMissingLinkedItems === true ? true : false;
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
        let mappedLinkedItem;
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
    mapRichTextLinks(linksJson) {
        const links = [];
        for (const linkId of Object.keys(linksJson)) {
            const linkRaw = linksJson[linkId];
            links.push(new Link({
                codename: linkRaw.codename,
                linkId: linkId,
                urlSlug: linkRaw.url_slug,
                type: linkRaw.type
            }));
        }
        return links;
    }
    mapRichTextImages(imagesJson) {
        const images = [];
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
    resolveElementMap(item, originalElementCodename) {
        let resolvedElementPropertyName = undefined;
        // resolve using property resolver
        if (item._config && item._config.propertyResolver) {
            resolvedElementPropertyName = item._config.propertyResolver(originalElementCodename);
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
    getGlobalUrlSlugResolverForType(type) {
        const item = stronglyTypedResolver.createEmptyItemInstanceOfType(type, this.config.typeResolvers || []);
        if (item && item._config && item._config.urlSlugResolver) {
            return item._config.urlSlugResolver;
        }
        return undefined;
    }
    getCollisionResolver() {
        return this.config.collisionResolver ? this.config.collisionResolver : defaultCollissionResolver;
    }
    collidesWithAnotherProperty(elementName, item) {
        return item[elementName] ? true : false;
    }
}
//# sourceMappingURL=element.mapper.js.map