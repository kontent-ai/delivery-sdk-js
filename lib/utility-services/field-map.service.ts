import { Injectable } from '@angular/core';
import { IModularContent } from '../interfaces/imodular-content.interface';
import { IItem } from '../interfaces/iitem.interface';
import { ResponseSingle, ResponseMultiple } from '../models/responses';
import { TextField, AssetsField, NumberField, MultipleChoiceField, DateTimeField, RichTextField } from '../fields/field-types';
import { IField } from '../interfaces/ifield.interface';
import { FieldType } from '../fields/field-type';
import { TypeResolver } from '../models/type-resolver.class';
import { TypeResolverService } from './type-resolver.service';

export class FieldMapService {

    constructor(
        private typeResolverService: TypeResolverService,
    ) {
    }

    mapFields(item: IItem, modularContent: any): any {
        var properties = Object.getOwnPropertyNames(item.elements);

        // create typed item
        var itemTyped = this.typeResolverService.createTypedObj(item.system.type, item);

        properties.forEach(fieldName => {
            var field = item.elements[fieldName] as IField;
            var propertyName;

            // resolve value into a different 'property'
            if (itemTyped.resolver) {
                propertyName = itemTyped.resolver(fieldName);
            }

            // if property name is null/empty, use elements codename
            if (!propertyName){
                propertyName = fieldName;
            }

            itemTyped[propertyName] = this.mapField(field, modularContent);
        });

        return itemTyped;
    }

    private mapField(field: IField, modularContent: any): any {
        if (field.type.toString() === FieldType.modular_content.toString()) {
            return this.mapModularField(field, modularContent);
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
            return this.mapRichTextField(field, modularContent);
        }
        else {
            console.log(`Unsupported field type '${field.type}'`);
            //throw Error(`Unsupported field type '${field.type}'`)
        }
    }

    private mapRichTextField(field: IField, modularContent: any): RichTextField {
        // get all modular content items nested in rich text
        var modularItems: IItem[] = [];

        if (field.modular_content){
            if (Array.isArray(field.modular_content)){
                field.modular_content.forEach(codename => {
                    // get modular item
                    var modularItem = this.mapFields(modularContent[codename], modularContent);

                    modularItems.push(modularItem);
                });
            }
        }

        return new RichTextField(field.name, field.type, field.value, modularItems);
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

    private mapModularField(field: IField, modularContent: any): any {
        var modularItem = modularContent[field.value[0]];

        return this.mapFields(modularItem, modularContent);
    }
}