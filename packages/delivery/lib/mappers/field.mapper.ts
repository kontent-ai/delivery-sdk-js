import { IDeliveryClientConfig } from '../config';
import { ItemContracts } from '../data-contracts';
import { FieldDecorators, FieldInterfaces, Fields, FieldType } from '../fields';
import { IItemQueryConfig } from '../interfaces';
import { ContentItem, Link } from '../models';
import { IRichTextHtmlParser } from '../parser/parse-models';
import { richTextResolver, stronglyTypedResolver, urlSlugResolver } from '../resolvers';

export class FieldMapper {

    private readonly defaultModularContentWrapperTag: string = 'p';
    private readonly defaultModularContentWrapperClasses: string[] = ['kc-modular-item-wrapper'];

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
            throw Error(`ProcessedItems need to be an array of 'IContentItems'`);
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
            const field = item.elements[fieldName] as FieldInterfaces.IField;
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

        return itemTyped;
    }

    private mapField(field: FieldInterfaces.IField, modularContent: any, item: ContentItem, queryConfig: IItemQueryConfig, processedItems: ContentItem[]): FieldInterfaces.IField {
        const fieldType = field.type.toLowerCase();

        if (fieldType === FieldType.ModularContent.toString()) {
            return this.mapModularField(field, modularContent, queryConfig, processedItems);
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
            return this.mapRichTextField(field as FieldInterfaces.IRichTextField, modularContent, queryConfig, processedItems);
        } else if (fieldType === FieldType.UrlSlug.toLowerCase()) {
            return this.mapUrlSlugField(field, item, queryConfig);
        } else if (fieldType === FieldType.Taxonomy.toLowerCase()) {
            return this.mapTaxonomyField(field);
        }

        const error = `Unsupported field type '${field.type}'`;

        throw Error(error);
    }

    private mapRichTextField(field: FieldInterfaces.IRichTextField, modularContent: any, queryConfig: IItemQueryConfig, processedItems: ContentItem[]): Fields.RichTextField {
        // get all modular content items nested in rich text
        const modularItems: ContentItem[] = [];

        if (field.modular_content) {
            if (Array.isArray(field.modular_content)) {
                field.modular_content.forEach(codename => {
                    // get modular item and check if it exists (it might not be included in response due to 'Depth' parameter)
                    const modularContentItem = modularContent[codename];

                    if (!modularContentItem) {
                        throw Error(`Modular content item with codename '${codename}' is not present in Delivery response.
                        This modular item was requested by '${field.name}' field.
                        Error can usually be solved by increasing 'Depth' parameter of your query.`);
                    }

                    const modularItem = this.mapFields(modularContent[codename], modularContent, queryConfig, processedItems);

                    if (modularItem != null) {
                        modularItems.push(modularItem);
                    }
                });
            }
        }

        // extract and map links
        const links: Link[] = this.mapRichTextLinks(field.links);

        return new Fields.RichTextField(
            field.name,
            field.value, {
                links: links,
                resolveHtml: () => richTextResolver.resolveHtml(field.value, {
                    enableAdvancedLogging: this.config.enableAdvancedLogging ? this.config.enableAdvancedLogging : false,
                    typeResolvers: this.config.typeResolvers ? this.config.typeResolvers : [],
                    richTextHtmlParser: this.richTextHtmlParser,
                    modularItems: modularItems,
                    links: links,
                    queryConfig: queryConfig,
                    modularContentWrapperTag: this.config.modularContentResolver && this.config.modularContentResolver.modularContentWrapperTag
                        ? this.config.modularContentResolver.modularContentWrapperTag
                        : this.defaultModularContentWrapperTag,
                    modularContentWrapperClasses: this.config.modularContentResolver && this.config.modularContentResolver.modularContentWrapperClasses
                        ? this.config.modularContentResolver.modularContentWrapperClasses
                        : this.defaultModularContentWrapperClasses
                })
            });
    }

    private mapDateTimeField(field: FieldInterfaces.IField): Fields.DateTimeField {
        return new Fields.DateTimeField(field.name, field.value);
    }

    private mapMultipleChoiceField(field: FieldInterfaces.IField): Fields.MultipleChoiceField {
        return new Fields.MultipleChoiceField(field.name, field.value);
    }

    private mapNumberField(field: FieldInterfaces.IField): Fields.NumberField {
        return new Fields.NumberField(field.name, field.value);
    }

    private mapTextField(field: FieldInterfaces.IField): Fields.TextField {
        return new Fields.TextField(field.name, field.value);
    }

    private mapAssetsField(field: FieldInterfaces.IField): Fields.AssetsField {
        return new Fields.AssetsField(field.name, field.value);
    }

    private mapTaxonomyField(field: FieldInterfaces.IField): Fields.TaxonomyField {
        return new Fields.TaxonomyField(field.name, field.value, field.taxonomy_group);
    }

    private mapUrlSlugField(field: FieldInterfaces.IField, item: ContentItem, queryConfig: IItemQueryConfig): Fields.UrlSlugField {
        const linkResolver = this.getLinkResolverForUrlSlugField(item, queryConfig);

        return new Fields.UrlSlugField(
            field.name,
            field.value,
            {
                resolveUrl: () => urlSlugResolver.resolveUrl({
                    fieldName: field.name,
                    type: field.type,
                    fieldValue: field.value,
                    item: item,
                    enableAdvancedLogging: this.config.enableAdvancedLogging ? this.config.enableAdvancedLogging : false,
                    linkResolver: linkResolver
                })
            });
    }

    private mapModularField(field: FieldInterfaces.IField, modularContent: any, queryConfig: IItemQueryConfig, processedItems: ContentItem[]): any {
        if (!field) {
            if (this.config.enableAdvancedLogging) {
                console.warn(`Cannot map modular content field because field does not exist`);
            }
            return null;
        }

        if (!field.value) {
            if (this.config.enableAdvancedLogging) {
                console.warn(`Cannot map modular content of '${field.name}' because its value does not exist`);
            }
            return null;
        }

        // modular content is always returned in an array
        const modularContentItems: any[] = [];
        const fieldModularContent = field.value as Array<string>;
        fieldModularContent.forEach(modularItemCodename => {
            const modularItem = modularContent[modularItemCodename];

            if (!modularItem) {
                if (this.config.enableAdvancedLogging) {
                    console.warn(`Cannot map '${field.name}' modular content item. Make sure you use 'DepthParameter' in case your modular content is nested.`);
                }
            }

            // try to map only if the modular item was present in response
            if (modularItem) {
                // add/taken item to processed items to avoid infinite recursion
                let processedItem = processedItems.find(m => m.system.codename === modularItem.system.codename);
                if (processedItem) {
                    modularContentItems.push(processedItem);
                } else {
                    const newModularItem = this.mapFields<any>(modularItem, modularContent, queryConfig, processedItems);
                    modularContentItems.push(newModularItem);
                    processedItem = newModularItem;
                }
            }
        });

        return modularContentItems;
    }

    private getLinkResolverForUrlSlugField(item: ContentItem, queryConfig: IItemQueryConfig): ((link: Link) => string) | undefined {
        // link resolver defined by the query config (= by calling method) has priority over type's global link resolver
        let linkResolver: ((value: Link) => string) | undefined = undefined;

        if (queryConfig.linkResolver) {
            linkResolver = queryConfig.linkResolver;
        } else {
            linkResolver = item.linkResolver;
        }

        return linkResolver;
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
