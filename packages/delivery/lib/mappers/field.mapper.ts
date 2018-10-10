import { IDeliveryClientConfig } from '../config';
import { ItemContracts } from '../data-contracts';
import { FieldDecorators, FieldContracts, Fields, FieldType } from '../fields';
import { IItemQueryConfig, ILinkResolverResult } from '../interfaces';
import { ContentItem, Link } from '../models';
import { IRichTextHtmlParser } from '../parser/parse-models';
import { richTextResolver, stronglyTypedResolver, urlSlugResolver } from '../resolvers';

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
     * @param item Item to map (raw response from Kentico Cloud)
     * @param modularContent Modular content sent along with item
     * @param queryConfig Query configuration
     */
    mapFields<TItem extends ContentItem>(item: ItemContracts.IContentItemContract, modularContent: any, queryConfig: IItemQueryConfig, processedItems: ContentItem[]): TItem {
        if (!item) {
            throw Error(`Cannot map fields because item is not defined`);
        }

        if (!item.system) {
            throw Error(`Cannot map item because it does not contain system attributes. This is an essential field and every item should have one.`);
        }

        if (!item.elements) {
            throw Error(`Cannot map elements of item with codename '${item.system.codename}'`);
        }

        if (!processedItems) {
            throw Error(`ProcessedItems need to be initialized`);
        }

        if (!Array.isArray(processedItems)) {
            throw Error(`ProcessedItems need to be an array`);
        }

        const properties = Object.getOwnPropertyNames(item.elements);

        let itemTyped: TItem;

        // check if resolver for this type is available
        if (this.config.typeResolvers && stronglyTypedResolver.hasTypeResolver(item.system.type, this.config.typeResolvers)) {
            itemTyped = stronglyTypedResolver.createTypedObj(item.system.type, item, this.config.typeResolvers) as TItem;
        } else {
            itemTyped = stronglyTypedResolver.createContentItem(item) as TItem;
        }

        // add/taken item to processed items to avoid infinite recursion
        const processedItem = processedItems.find(m => m.system.codename === item.system.codename);
        if (!processedItem) {
            processedItems.push(itemTyped);
        }

        properties.forEach(fieldName => {
            const field = item.elements[fieldName] as FieldContracts.IField;
            let propertyName: string | undefined;

            // resolve field to a custom model property
            if (itemTyped.propertyResolver) {
                propertyName = itemTyped.propertyResolver(fieldName);
            }

            // if property hasn't been resolved, try with decorator
            if (!propertyName) {
                propertyName = FieldDecorators.getPropertyName(itemTyped, fieldName);
            }

            // if property name is null/empty, use elements codename
            if (!propertyName) {
                propertyName = fieldName;
            }
            itemTyped[propertyName] = this.mapField(field, modularContent, itemTyped, queryConfig, processedItems);
        });

        // keep the elements property if devs wanted to use them directly and for potential debugging
        itemTyped.elements = item.elements;

        return itemTyped;
    }

    private mapField(field: FieldContracts.IField, modularContent: any, item: ContentItem, queryConfig: IItemQueryConfig, processedItems: ContentItem[]): FieldContracts.IField | ContentItem[] | undefined {
        const fieldType = field.type.toLowerCase();

        if (fieldType === FieldType.ModularContent.toString()) {
            return this.mapLinkedItemsField(field, modularContent, queryConfig, processedItems);
        } else if (fieldType === FieldType.Text.toLowerCase()) {
            return this.mapTextField(field);
        } else if (fieldType === FieldType.Asset.toLowerCase()) {
            return this.mapAssetsField(field);
        } else if (fieldType === FieldType.Number.toLowerCase()) {
            return this.mapNumberField(field);
        } else if (fieldType === FieldType.MultipleChoice.toLowerCase()) {
            return this.mapMultipleChoiceField(field);
        } else if (fieldType === FieldType.DateTime.toLowerCase()) {
            return this.mapDateTimeField(field);
        } else if (fieldType === FieldType.RichText.toLowerCase()) {
            return this.mapRichTextField(field as FieldContracts.IRichTextField, modularContent, queryConfig, processedItems);
        } else if (fieldType === FieldType.UrlSlug.toLowerCase()) {
            return this.mapUrlSlugField(field, item, queryConfig);
        } else if (fieldType === FieldType.Taxonomy.toLowerCase()) {
            return this.mapTaxonomyField(field);
        }

        const error = `Unsupported field type '${field.type}'`;

        throw Error(error);
    }

    private mapRichTextField(field: FieldContracts.IRichTextField, modularContent: any, queryConfig: IItemQueryConfig, processedItems: ContentItem[]): Fields.RichTextField {
        // get all linked items nested in rich text
        const linkedItems: ContentItem[] = [];

        if (field.modular_content) {
            if (Array.isArray(field.modular_content)) {
                field.modular_content.forEach(codename => {
                    // get linked item and check if it exists (it might not be included in response due to 'Depth' parameter)
                    const linkedItemFromModularContent = modularContent[codename];

                    if (!linkedItemFromModularContent) {
                        throw Error(`Linked item with codename '${codename}' is not present in Delivery response.
                        This linked item was requested by '${field.name}' field.
                        Error can usually be solved by increasing 'Depth' parameter of your query.`);
                    }

                    const linkedItem = this.mapFields(modularContent[codename], modularContent, queryConfig, processedItems);

                    if (linkedItem != null) {
                        linkedItems.push(linkedItem);
                    }
                });
            }
        }

        // extract and map links
        const links: Link[] = this.mapRichTextLinks(field.links);

        console.log('THIUS IS IS', field);
        return new Fields.RichTextField(
            field.name,
            field.value,
            field.modular_content,
            {
                links: links,
                resolveHtml: () => richTextResolver.resolveHtml(field.value, {
                    enableAdvancedLogging: this.config.enableAdvancedLogging ? this.config.enableAdvancedLogging : false,
                    typeResolvers: this.config.typeResolvers ? this.config.typeResolvers : [],
                    richTextHtmlParser: this.richTextHtmlParser,
                    getLinkedItem: (codename) => this.getOrSaveLinkedItem(codename, field, queryConfig, modularContent, linkedItems),
                    links: links,
                    queryConfig: queryConfig,
                    linkedItemWrapperTag: this.config.linkedItemResolver && this.config.linkedItemResolver.linkedItemWrapperTag
                        ? this.config.linkedItemResolver.linkedItemWrapperTag
                        : this.defaultLinkedItemWrapperTag,
                    linkedItemWrapperClasses: this.config.linkedItemResolver && this.config.linkedItemResolver.linkedItemWrapperClasses
                        ? this.config.linkedItemResolver.linkedItemWrapperClasses
                        : this.defaultLinkedItemWrapperClasses
                })
            });
    }

    private mapDateTimeField(field: FieldContracts.IField): Fields.DateTimeField {
        return new Fields.DateTimeField(field.name, field.value);
    }

    private mapMultipleChoiceField(field: FieldContracts.IField): Fields.MultipleChoiceField {
        return new Fields.MultipleChoiceField(field.name, field.value);
    }

    private mapNumberField(field: FieldContracts.IField): Fields.NumberField {
        return new Fields.NumberField(field.name, field.value);
    }

    private mapTextField(field: FieldContracts.IField): Fields.TextField {
        return new Fields.TextField(field.name, field.value);
    }

    private mapAssetsField(field: FieldContracts.IField): Fields.AssetsField {
        return new Fields.AssetsField(field.name, field.value);
    }

    private mapTaxonomyField(field: FieldContracts.IField): Fields.TaxonomyField {
        return new Fields.TaxonomyField(field.name, field.value, field.taxonomy_group);
    }

    private mapUrlSlugField(field: FieldContracts.IField, item: ContentItem, queryConfig: IItemQueryConfig): Fields.UrlSlugField {
        const linkResolver = this.getLinkResolverForUrlSlugField(item, queryConfig);

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

    private mapLinkedItemsField(field: FieldContracts.IField, modularContent: any, queryConfig: IItemQueryConfig, processedItems: ContentItem[]): ContentItem[] | undefined {
        if (!field) {
            if (this.config.enableAdvancedLogging) {
                console.warn(`Cannot map linked item field because field does not exist`);
            }
            return undefined;
        }

        if (!field.value) {
            if (this.config.enableAdvancedLogging) {
                console.warn(`Cannot map linked item of '${field.name}' because its value does not exist`);
            }
            return undefined;
        }

        // result is always an array of content items
        const result: ContentItem[] = [];

        // value = array of item codenames
        const linkedItemCodenames = field.value as string[];
        linkedItemCodenames.forEach(codename => {
            const linkedItem = processedItems.find(m => m.system.codename === codename);
            if (linkedItem) {
                result.push(linkedItem);
            }
        });

        return result;
    }

    private getLinkResolverForUrlSlugField(item: ContentItem, queryConfig: IItemQueryConfig): ((link: Link) => string | undefined | ILinkResolverResult) | undefined {
        // link resolver defined by the query config (= by calling method) has priority over type's global link resolver
        let linkResolver: ((value: Link) => string | undefined | ILinkResolverResult) | undefined = undefined;

        if (queryConfig.linkResolver) {
            linkResolver = queryConfig.linkResolver;
        } else {
            linkResolver = item.linkResolver;
        }

        return linkResolver;
    }

    private getOrSaveLinkedItem(codename: string, field: FieldContracts.IField, queryConfig: IItemQueryConfig, modularContent: any, processedItems: ContentItem[]): ContentItem | undefined {
        const rawLinkedItem = modularContent[codename] as ItemContracts.IContentItemContract;

            if (!rawLinkedItem) {
                if (this.config.enableAdvancedLogging) {
                    console.warn(`Cannot map '${field.name}' linked item. Try increasing 'DepthParameter' so that nested items are included in the response.`);
                }
            }

            // try to map only if the linked item was present in response
            if (rawLinkedItem) {
                // check item first to avoid infinite recursion
                const existingItem = processedItems.find(m => m.system.codename === rawLinkedItem.system.codename);
                if (existingItem) {
                    return existingItem;
                } else {
                    // or create new item and add it to processed array
                    const newLinkedItem = this.mapFields<any>(rawLinkedItem, modularContent, queryConfig, processedItems);
                    processedItems.push(newLinkedItem);
                    return newLinkedItem;
                }
            }

        return undefined;
    }

    private mapRichTextLinks(linksJson: any): Link[] {
        const links: Link[] = [];

        for (const linkItemId of Object.keys(linksJson)) {
            const linkRaw: ItemContracts.ILinkContract = linksJson[linkItemId] as ItemContracts.ILinkContract;
            links.push(new Link({
                codename: linkRaw.codename,
                itemId: linkItemId,
                urlSlug: linkRaw.url_slug,
                type: linkRaw.type
            }));
        }

        return links;
    }
}
