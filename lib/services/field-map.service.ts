import { IModularContent } from '../interfaces/item/imodular-content.interface';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { FieldInterfaces } from '../fields/field-interfaces';
import { FieldType } from '../fields/field-type';
import { Fields } from '../fields/field-types';
import { TypeResolverService } from './type-resolver.service';
import { DeliveryClientConfig } from '../config/delivery-client.config';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';

export class FieldMapService {

    private typeResolverService: TypeResolverService;

    private processedItems: IContentItem[] = [];
    constructor(
        private config: DeliveryClientConfig,
    ) {
        this.typeResolverService = new TypeResolverService(config);
    }

    /**
     * Maps all fields in given content item and returns strongly typed content item based on the resolver specified
     * in DeliveryClientConfig
     * @param item Item to map (raw response from Kentico Cloud)
     * @param modularContent Modular content sent along with item
     * @param queryConfig Query configuration
     */
    mapFields<TItem extends IContentItem>(item: IContentItem, modularContent: any, queryConfig: IItemQueryConfig): TItem {
        if (!item) {
            return null;
        }

        var properties = Object.getOwnPropertyNames(item.elements);

        // create typed item
        var itemTyped = this.typeResolverService.createTypedObj(item.system.type, item) as TItem;

        // add/taken item to processed items to avoid infinite recursion
        var processedItem = this.processedItems.find(m => m.system.codename === item.system.codename);
        if (!processedItem) {
            this.processedItems.push(itemTyped);
        }

        properties.forEach(fieldName => {
            var field = item.elements[fieldName] as FieldInterfaces.IField;
            var propertyName;

            // resolve value into a different 'property'
            if (itemTyped.resolver) {
                propertyName = itemTyped.resolver(fieldName);
            }

            // if property name is null/empty, use elements codename
            if (!propertyName) {
                propertyName = fieldName;
            }

            itemTyped[propertyName] = this.mapField(field, modularContent, itemTyped, queryConfig);
        });

        return itemTyped;
    }

    private mapField(field: FieldInterfaces.IField, modularContent: any, item: IContentItem, queryConfig: IItemQueryConfig): any {
        if (field.type.toString() === FieldType.modular_content.toString()) {
            return this.mapModularField(field, modularContent, queryConfig);
        }
        else if (field.type.toString() === FieldType.text.toString()) {
            return this.mapTextField(field);
        }
        else if (field.type.toString() === FieldType.asset.toString()) {
            return this.mapAssetsField(field);
        }
        else if (field.type.toString() === FieldType.number.toString()) {
            return this.mapNumberField(field);
        }
        else if (field.type.toString() === FieldType.multiple_choice.toString()) {
            return this.mapMultipleChoiceField(field);
        }
        else if (field.type.toString() === FieldType.datetime.toString()) {
            return this.mapDateTimeField(field);
        }
        else if (field.type.toString() === FieldType.rich_text.toString()) {
            return this.mapRichTextField(field, modularContent, queryConfig);
        }
        else if (field.type.toString() === FieldType.url_slug.toString()) {
            return this.mapUrlSlugField(field, item, queryConfig);
        }
        else if (field.type.toString() === FieldType.taxonomy.toString()) {
            return this.mapTaxonomyField(field);
        }
        else {
            var err = `Unsupported field type '${field.type}'`
            if (this.config.enableAdvancedLogging) {
                console.log(err, field);
            }
            throw Error(err)
        }
    }

    private mapRichTextField(field: FieldInterfaces.IField, modularContent: any, queryConfig: IItemQueryConfig): Fields.RichTextField {
        // get all modular content items nested in rich text
        var modularItems: IContentItem[] = [];

        if (field.modular_content) {
            if (Array.isArray(field.modular_content)) {
                field.modular_content.forEach(codename => {
                    // get modular item
                    var modularItem = this.mapFields(modularContent[codename], modularContent, queryConfig);

                    modularItems.push(modularItem);
                });
            }
        }

        return new Fields.RichTextField(field.name, field.value, modularItems, this.config.enableAdvancedLogging, queryConfig.richTextResolver);
    }

    private mapDateTimeField(field: FieldInterfaces.IField): Fields.DateTimeField {
        return new Fields.DateTimeField(field.name, field.value);
    }

    private mapMultipleChoiceField(field: FieldInterfaces.IField): Fields.MultipleChoiceField {
        return new Fields.MultipleChoiceField(field.name, field.value);
    }

    private mapNumberField(field: FieldInterfaces.IField): Fields.NumberField {
        return new Fields.NumberField(field.name,  field.value);
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

    private mapUrlSlugField(field: FieldInterfaces.IField, item: IContentItem, queryConfig: IItemQueryConfig): Fields.UrlSlugField {
        // url slug defined by the 'config' (= by calling method) has priority over type's url slug
        var urlSlug: (item: IContentItem, value: string) => string;

        if (queryConfig.urlSlugResolver) {
            urlSlug = queryConfig.urlSlugResolver;
        }
        else {
            urlSlug = item.urlSlugResolver;
        }

        return new Fields.UrlSlugField(field.name, field.value, item, urlSlug, this.config.enableAdvancedLogging);
    }

    private mapModularField(field: FieldInterfaces.IField, modularContent: any, queryConfig: IItemQueryConfig): any {
        if (!field) {
            if (this.config.enableAdvancedLogging) {
                console.log(`Cannot map modular content field because field does not exist`);
            }
            return null;
        }

        if (!field.value) {
            if (this.config.enableAdvancedLogging) {
                console.log(`Cannot map modular content of '${field.name}' because its value does not exist`);
            }
            return null;
        }

        // modular content is always returned in an array
        var modularContentItems: any[] = [];
        var fieldModularContent = field.value as Array<string>;
        fieldModularContent.forEach(modularItemCodename => {
            var modularItem = modularContent[modularItemCodename];

            if (!modularItem) {
                if (this.config.enableAdvancedLogging) {
                    console.log(`Cannot map '${field.name}' modular content item. Make sure you use 'DepthParameter' in case your modular content is nested.`)
                }
            }

            // try to map only if the modular item was present in response
            if (modularItem) {
                // add/taken item to processed items to avoid infinite recursion
                var processedItem = this.processedItems.find(m => m.system.codename === modularItem.system.codename);
                if (processedItem) {
                    modularContentItems.push(processedItem);
                }
                else {
                    var modularItem = this.mapFields<any>(modularItem, modularContent, queryConfig);
                    modularContentItems.push(modularItem);
                    processedItem = modularItem;
                }
            }
        })

        return modularContentItems;
    }
}