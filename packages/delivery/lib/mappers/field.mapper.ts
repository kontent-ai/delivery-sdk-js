import { enumHelper } from 'kentico-cloud-core';

import { defaultCollissionResolver as defaultCollisionResolver, IDeliveryClientConfig } from '../config';
import { ItemContracts } from '../data-contracts';
import { FieldContracts, FieldDecorators, FieldModels, Fields, FieldType } from '../fields';
import { IContentItem, IItemQueryConfig } from '../interfaces';
import {
    ContentItem,
    IContentItemsContainer,
    ItemFieldCollisionResolver,
    ItemLinkResolver,
    Link,
    RichTextImage,
} from '../models';
import { IRichTextHtmlParser } from '../parser/parse-models';
import { richTextResolver, stronglyTypedResolver, urlSlugResolver } from '../resolvers';

export interface IMapFieldsResult<TItem extends IContentItem = IContentItem> {
    item: TItem;
    processedItems: IContentItemsContainer;
    preparedItems: IContentItemsContainer;
    processingStartedForCodenames: string[];
}

export interface IFieldMapWrapper {
    resolvedFieldName: string;
    field: FieldContracts.IFieldContract;
}

export class FieldMapper {

    private readonly defaultLinkedItemWrapperTag: string = 'p';
    private readonly defaultLinkedItemWrapperClasses: string[] = ['kc-linked-item-wrapper'];

    constructor(
        private readonly config: IDeliveryClientConfig,
        private readonly richTextHtmlParser: IRichTextHtmlParser
    ) {
    }

    /**
     * Maps all fields in given content item and returns strongly typed content item based on the resolver specified
     * in DeliveryClientConfig
     */
    mapFields<TItem extends IContentItem = IContentItem>(data: {
        item: ItemContracts.IContentItemContract,
        modularContent: ItemContracts.IModularContentWrapperContract,
        queryConfig: IItemQueryConfig,
        processedItems: IContentItemsContainer,
        processingStartedForCodenames: string[],
        preparedItems: IContentItemsContainer
    }): IMapFieldsResult<TItem> {
        if (!data.item) {
            throw Error(`Cannot map fields because item is not defined`);
        }

        if (!data.item.system) {
            throw Error(`Cannot map item because it does not contain system attributes. This is an essential field and every item should have one.`);
        }

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

            const field = data.item.elements[elementCodename];
            const fieldMapping = this.resolveFieldMapping(itemInstance, elementCodename);

            if (fieldMapping.shouldMapField) {
                itemInstance[fieldMapping.resolvedName] = this.mapField({
                    fieldWrapper: {
                        field: field,
                        resolvedFieldName: fieldMapping.resolvedName
                    },
                    item: itemInstance,
                    modularContent: data.modularContent,
                    preparedItems: data.preparedItems,
                    processingStartedForCodenames: data.processingStartedForCodenames,
                    processedItems: data.processedItems,
                    queryConfig: data.queryConfig
                });
            }
        });

        return {
            item: itemInstance,
            processedItems: data.processedItems,
            preparedItems: data.preparedItems,
            processingStartedForCodenames: data.processingStartedForCodenames
        };
    }

    private mapField(
        data: {
            fieldWrapper: IFieldMapWrapper,
            modularContent: ItemContracts.IModularContentWrapperContract,
            item: IContentItem,
            queryConfig: IItemQueryConfig,
            processedItems: IContentItemsContainer,
            processingStartedForCodenames: string[],
            preparedItems: IContentItemsContainer
        }): undefined | FieldModels.IField | IContentItem[] {
        const fieldType = enumHelper.getEnumFromValue<FieldType>(FieldType, data.fieldWrapper.field.type);
        if (fieldType) {

            if (fieldType === FieldType.ModularContent) {
                return this.mapLinkedItemsField({
                    fieldWrapper: data.fieldWrapper,
                    modularContent: data.modularContent,
                    preparedItems: data.preparedItems,
                    processingStartedForCodenames: data.processingStartedForCodenames,
                    processedItems: data.processedItems,
                    queryConfig: data.queryConfig
                });
            }

            if (fieldType === FieldType.Text) {
                return this.mapTextField(data.fieldWrapper);
            }
            if (fieldType === FieldType.Asset) {
                return this.mapAssetsField(data.fieldWrapper);
            }

            if (fieldType === FieldType.Number) {
                return this.mapNumberField(data.fieldWrapper);
            }
            if (fieldType === FieldType.MultipleChoice) {
                return this.mapMultipleChoiceField(data.fieldWrapper);
            }

            if (fieldType === FieldType.DateTime) {
                return this.mapDateTimeField(data.fieldWrapper);
            }

            if (fieldType === FieldType.RichText) {
                return this.mapRichTextField(data.fieldWrapper, data.modularContent, data.queryConfig, data.processedItems, data.processingStartedForCodenames, data.preparedItems);
            }

            if (fieldType === FieldType.UrlSlug) {
                return this.mapUrlSlugField(data.fieldWrapper, data.item, data.queryConfig);
            }

            if (fieldType === FieldType.Taxonomy) {
                return this.mapTaxonomyField(data.fieldWrapper);
            }

            if (fieldType === FieldType.Custom) {
                return this.mapCustomField(data.fieldWrapper, data.item.system.type);
            }
        }
        console.warn(`Skipping unknown field type '${data.fieldWrapper.field.type}' of field '${data.fieldWrapper.field.name}'`);
        return undefined;
    }

    private mapRichTextField(
        fieldWrapper: IFieldMapWrapper,
        modularContent: ItemContracts.IModularContentWrapperContract,
        queryConfig: IItemQueryConfig,
        processedItems: IContentItemsContainer,
        processingStartedForCodenames: string[],
        preparedItems: IContentItemsContainer): Fields.RichTextField {

        // get all linked items nested in rich text
        const richTextLinkedItems: IContentItem[] = [];

        const field = fieldWrapper.field as FieldContracts.IRichTextFieldContract;

        if (field.modular_content) {
            if (Array.isArray(field.modular_content)) {
                field.modular_content.forEach(codename => {
                    // get linked item and check if it exists (it might not be included in response due to 'Depth' parameter)
                    const rawItem = modularContent[codename] as ItemContracts.IContentItemContract | undefined;

                    // first try to get existing item
                    const existingLinkedItem = this.getOrSaveLinkedItemForField(codename, field, queryConfig, modularContent, processedItems, processingStartedForCodenames, preparedItems);

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
                            const msg = `Mapping RichTextField field '${field.name}' failed because referenced linked item with codename '${codename}' could not be found in Delivery response.
                            Increasing 'depth' parameter may solve this issue as it will include nested items. Alternatively you may disable 'throwErrorForMissingLinkedItems' in your query`;

                            if (throwErrorForMissingLinkedItems) {
                                throw Error(msg);
                            }
                        }

                        // item was not found or not yet resolved
                        if (rawItem) {
                            const mappedLinkedItemResult = this.mapFields({
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
        const links: Link[] = this.mapRichTextLinks(field.links);
        const images: RichTextImage[] = this.mapRichTextImages(field.images);

        return new Fields.RichTextField(
            field.name,
            field.value,
            field.modular_content,
            {
                links: links,
                resolveHtml: () => richTextResolver.resolveHtml('', field.value, fieldWrapper.resolvedFieldName, {
                    enableAdvancedLogging: this.config.enableAdvancedLogging ? this.config.enableAdvancedLogging : false,
                    images: images,
                    richTextHtmlParser: this.richTextHtmlParser,
                    getLinkedItem: (codename) => this.getOrSaveLinkedItemForField(codename, field, queryConfig, modularContent, processedItems, processingStartedForCodenames, preparedItems),
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

    private mapDateTimeField(fieldWrapper: IFieldMapWrapper): Fields.DateTimeField {
        return new Fields.DateTimeField(fieldWrapper.field.name, fieldWrapper.field.value);
    }

    private mapMultipleChoiceField(fieldWrapper: IFieldMapWrapper): Fields.MultipleChoiceField {
        return new Fields.MultipleChoiceField(fieldWrapper.field.name, fieldWrapper.field.value);
    }

    private mapNumberField(fieldWrapper: IFieldMapWrapper): Fields.NumberField {
        return new Fields.NumberField(fieldWrapper.field.name, fieldWrapper.field.value);
    }

    private mapTextField(fieldWrapper: IFieldMapWrapper): Fields.TextField {
        return new Fields.TextField(fieldWrapper.field.name, fieldWrapper.field.value);
    }

    private mapAssetsField(fieldWrapper: IFieldMapWrapper): Fields.AssetsField {
        return new Fields.AssetsField(fieldWrapper.field.name, fieldWrapper.field.value);
    }

    private mapTaxonomyField(fieldWrapper: IFieldMapWrapper): Fields.TaxonomyField {
        return new Fields.TaxonomyField(fieldWrapper.field.name, fieldWrapper.field.value, fieldWrapper.field.taxonomy_group);
    }

    private mapCustomField(fieldWrapper: IFieldMapWrapper, contentType: string): Fields.CustomField | FieldModels.IField {
        // try to find field resolver
        if (this.config.fieldResolver) {
            const customModel = this.config.fieldResolver(contentType, fieldWrapper.field.name, fieldWrapper.field.value);

            if (customModel) {
                return customModel;
            }

        }
        return new Fields.CustomField(fieldWrapper.field.name, fieldWrapper.field.value);
    }

    private mapUrlSlugField(fieldWrapper: IFieldMapWrapper, item: IContentItem, queryConfig: IItemQueryConfig): Fields.UrlSlugField {
        const linkResolver = this.getLinkResolverForUrlSlugField(item, queryConfig);
        const field = fieldWrapper.field;
        return new Fields.UrlSlugField(
            field.name,
            field.value,
            {
                resolveLink: () => urlSlugResolver.resolveUrl({
                    fieldName: field.name,
                    type: field.type,
                    fieldValue: field.value,
                    item: item,
                    enableAdvancedLogging: this.config.enableAdvancedLogging ? this.config.enableAdvancedLogging : false,
                    linkResolver: linkResolver
                })
            });
    }

    private mapLinkedItemsField(data: {
        fieldWrapper: IFieldMapWrapper,
        modularContent: ItemContracts.IModularContentWrapperContract,
        queryConfig: IItemQueryConfig,
        processedItems: IContentItemsContainer,
        processingStartedForCodenames: string[],
        preparedItems: IContentItemsContainer
    }
    ): ContentItem[] {
        if (!data.fieldWrapper) {
            if (this.config.enableAdvancedLogging) {
                console.warn(`Cannot map linked item field because field does not exist. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
            }
            return [];
        }

        if (!data.fieldWrapper.field.value) {
            if (this.config.enableAdvancedLogging) {
                console.warn(`Cannot map linked item of '${data.fieldWrapper.field.name}' because its value does not exist. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
            }
            return [];
        }

        // result is always an array of content items
        const result: IContentItem[] = [];

        // value = array of item codenames
        const linkedItemCodenames = data.fieldWrapper.field.value as string[];
        linkedItemCodenames.forEach(codename => {
            const linkedItem = this.getOrSaveLinkedItemForField(codename, data.fieldWrapper.field, data.queryConfig, data.modularContent, data.processedItems, data.processingStartedForCodenames, data.preparedItems);
            if (linkedItem) {
                // add item to result
                result.push(linkedItem);
            } else {
                // item was not found
                if (this.config.enableAdvancedLogging) {
                    // tslint:disable-next-line:max-line-length
                    console.warn(`Linked item with codename '${codename}' in linked items field '${data.fieldWrapper.field.name}' of '${data.fieldWrapper.field.type}' type could not be found. If you require this item, consider increasing 'depth' of your query. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
                }
            }
        });

        return result;
    }

    private getLinkResolverForUrlSlugField(item: IContentItem, queryConfig: IItemQueryConfig): ItemLinkResolver | undefined {
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

    private getOrSaveLinkedItemForField(
        codename: string,
        field: FieldContracts.IFieldContract,
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
                This linked item was requested by '${field.name}' field of '${field.type}'.
                Error can usually be solved by increasing 'Depth' parameter of your query.
                Alternatively, you may prevent this error by disabling 'throwErrorForMissingLinkedItems' in query configuration.`);
            }

            return undefined;
        }

        let mappedLinkedItem: IContentItem | undefined;

        // try resolving item using custom item resolver if its set
        if (queryConfig.itemResolver) {
            const customMappedItem = queryConfig.itemResolver(field, rawItem, modularContent, queryConfig);

            if (customMappedItem) {
                // if user used custom mapping, make sure to add 'system' and 'elements' properties to result
                customMappedItem.system = stronglyTypedResolver.mapSystemAttributes(rawItem.system);
                customMappedItem.elements = rawItem.elements;
                mappedLinkedItem = customMappedItem;
            }
        }

        // original resolving if item is still undefined
        if (!mappedLinkedItem) {
            const mappedLinkedItemResult = this.mapFields(
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

    private mapRichTextLinks(linksJson: FieldContracts.IRichTextFieldLinkWrapperContract): Link[] {
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

    private mapRichTextImages(imagesJson: FieldContracts.IRichTextFieldImageWrapperContract): RichTextImage[] {
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

    private resolveFieldMapping(item: IContentItem, originalFieldCodename: string): {
        shouldMapField: boolean,
        resolvedName: string
    } {
        let resolvedName: string | undefined = undefined;

        // resolve using property resolver
        if (item.propertyResolver) {
            resolvedName = item.propertyResolver(originalFieldCodename);
        }

        // if property hasn't been resolved, try getting name using decorator
        if (resolvedName === originalFieldCodename || !resolvedName) {
            resolvedName = FieldDecorators.getPropertyName(item, originalFieldCodename);
        }

        if (!resolvedName) {
            // use original field codename
            resolvedName = originalFieldCodename;
        }

        // check for collissions
        if (this.collidesWithAnotherField(resolvedName, item)) {
            // try to resolve collission using dedicated resolver
            const collisionResolver = this.getCollisionResolver();
            resolvedName = collisionResolver(resolvedName);

            // verify again if the new field collides
            if (this.collidesWithAnotherField(resolvedName, item)) {
                console.warn(`Field '${resolvedName}' collides with another field in same type. Field mapping is skipped. Source item: '${item.system.codename}'`);
                return {
                    shouldMapField: false,
                    resolvedName: ''
                };
            }
        }

        return {
            resolvedName: resolvedName,
            shouldMapField: true
        };
    }

    private getCollisionResolver(): ItemFieldCollisionResolver {
        return this.config.collisionResolver ? this.config.collisionResolver : defaultCollisionResolver;
    }

    private collidesWithAnotherField(fieldName: string, item: IContentItem): boolean {
        return item[fieldName] ? true : false;
    }
}
