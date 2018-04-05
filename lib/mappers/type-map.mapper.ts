import { IElementOption } from '../interfaces/element/ielement-option.interface';
import { CloudTypeResponseInterfaces } from '../interfaces/type/cloud-responses';
import { IContentType } from '../interfaces/type/icontent-type.interface';
import { ElementOption } from '../models/element/element-option.class';
import { Element } from '../models/element/element.class';
import { ContentTypeSystemAttributes } from '../models/type/content-type-system-attributes.class';
import { ContentType } from '../models/type/content-type.class';

export class TypeMapper {

    mapSingleType(response: CloudTypeResponseInterfaces.ICloudSingleTypeResponse): ContentType {
        return this.mapType(response as IContentType);
    }

    mapMultipleTypes(response: CloudTypeResponseInterfaces.ICloudMultipleTypeResponse): ContentType[] {
        const that = this;
        return response.types.map(function (type) {
            return that.mapType(type);
        });
    }

    private mapType(type: IContentType): ContentType {
        if (!type) {
            throw Error(`Cannot map type`);
        }

        if (!type.elements) {
            throw Error(`Cannot map type elements`);
        }

        const typeSystem = new ContentTypeSystemAttributes(
            type.system.id,
            type.system.name,
            type.system.codename,
            type.system.last_modified
        );

        const elements: Element[] = [];

        const elementNames = Object.getOwnPropertyNames(type.elements);
        elementNames.forEach(elementName => {
            const typeElement = type.elements[elementName] as CloudTypeResponseInterfaces.IContentTypeElementCloudResponse;

            if (!typeElement) {
                throw Error(`Cannot find element '${elementName}' on type '${type}'`);
            }

            // use json property as a codename of the type element
            const elementCodename = elementName;

            // extra properties for certain field types
            const taxonomyGroup: string | undefined = typeElement.taxonomy_group;
            const options: IElementOption[] = [];

            // some elements can contain options
            const rawOptions = typeElement.options;
            if (rawOptions) {
                if (!Array.isArray(rawOptions)) {
                    throw Error(`Content type 'options' property has to be an array`);
                }

                rawOptions.forEach(rawOption => {
                    options.push(new ElementOption(rawOption.name, rawOption.codename));
                });
            }

            elements.push(new Element(elementCodename, typeElement.type, typeElement.name, taxonomyGroup, options));
        });
        return new ContentType(typeSystem, elements);
    }

}
