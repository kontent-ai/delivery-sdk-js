import { IModularContent } from '../interfaces/item/imodular-content.interface';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { TextField, AssetsField, NumberField, MultipleChoiceField, DateTimeField, RichTextField, UrlSlugField } from '../fields/field-types';
import { IField } from '../interfaces/item/ifield.interface';
import { FieldType } from '../fields/field-type';
import { TypeResolver } from '../models/item/type-resolver.class';
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

    mapFields(item: IContentItem, modularContent: any, queryConfig: IItemQueryConfig): any {
        if (!item) {
            return null;
        }

        var properties = Object.getOwnPropertyNames(item.elements);

        // create typed item
        var itemTyped = this.typeResolverService.createTypedObj(item.system.type, item);

        // add/taken item to processed items to avoid infinite recursion
        var processedItem = this.processedItems.find(m => m.system.codename === item.system.codename);
        if (!processedItem) {
            this.processedItems.push(itemTyped);
        }

        properties.forEach(fieldName => {
            var field = item.elements[fieldName] as IField;
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

    private mapField(field: IField, modularContent: any, item: IContentItem, queryConfig: IItemQueryConfig): any {
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
        else {
            var err = `Unsupported field type '${field.type}'`
            if (this.config.enableAdvancedLogging) {
                console.log(err, field);
            }
            throw Error(err)
        }
    }

    private mapRichTextField(field: IField, modularContent: any, queryConfig: IItemQueryConfig): RichTextField {
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

        return new RichTextField(field.name, field.type, field.value, modularItems, this.config.enableAdvancedLogging);
    }

    private mapDateTimeField(field: IField): DateTimeField {
        return new DateTimeField(field.name, field.type, field.value);
    }

    private mapMultipleChoiceField(field: IField): MultipleChoiceField {
        return new MultipleChoiceField(field.name, field.type, field.value);
    }

    private mapNumberField(field: IField): NumberField {
        return new NumberField(field.name, field.type, field.value);
    }

    private mapTextField(field: IField): TextField {
        return new TextField(field.name, field.type, field.value);
    }

    private mapAssetsField(field: IField): AssetsField {
        return new AssetsField(field.name, field.type, field.value);
    }

    private mapUrlSlugField(field: IField, item: IContentItem, config: IItemQueryConfig): UrlSlugField {
        // url slug defined by the 'config' (= by calling method) has priority over type's url slug
        var urlSlug: (item: IContentItem, value: string) => string;

        if (config.urlSlugResolver) {
            urlSlug = config.urlSlugResolver;
        }
        else {
            urlSlug = item.urlSlugResolver;
        }

        return new UrlSlugField(field.name, field.type, field.value, item, urlSlug, this.config.enableAdvancedLogging);
    }

    private mapModularField(field: IField, modularContent: any, queryConfig: IItemQueryConfig): any {
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
                    var modularItem = this.mapFields(modularItem, modularContent, queryConfig);
                    modularContentItems.push(modularItem);
                    processedItem = modularItem;
                }
            }
        })

        return modularContentItems;
    }
}