import { CloudTypeResponseInterfaces } from '../interfaces/type/cloud-responses';
import { IContentType } from '../interfaces/type/icontent-type.interface';
import { ContentType } from '../models/type/content-type.class';
import { ContentTypeSystemAttributes } from '../models/type/content-type-system-attributes.class';
import { Element } from '../models/element/element.class';
import { ElementOption } from '../models/element/element-option.class';
import { IElement } from '../interfaces/element/ielement.interface';
import { IElementOption } from '../interfaces/element/ielement-option.interface';

export class TypeMapService {

    constructor(
    ) {
    }

    private mapType(type: IContentType): ContentType {
        if (!type) {
            throw Error(`Cannot map type: ` + type);
        }

        var typeSystem = new ContentTypeSystemAttributes(
            type.system.id,
            type.system.name,
            type.system.codename,
            type.system.last_modified
        );

        var elements: Element[] = [];

        if (type.elements) {
            var elementNames = Object.getOwnPropertyNames(type.elements);
            if (elementNames) {
                elementNames.forEach(elementName => {
                    var typeElement = type.elements[elementName] as CloudTypeResponseInterfaces.IContentTypeElementCloudResponse;

                    if (!typeElement) {
                        throw Error(`Cannot find element '${elementName}' on type '${type}'`);
                    }

                    // use json property as a codename of the type element
                    var elementCodename = elementName;

                    // extra properties for certain field types
                    var taxonomyGroup: string | undefined = typeElement.taxonomy_group;
                    var options: IElementOption[] = [];

                    // some elements can contain options
                    var rawOptions = typeElement.options;
                    if (rawOptions){
                        if (!Array.isArray(rawOptions)){
                            throw Error(`Content type 'options' property has to be an array`);
                        }

                        rawOptions.forEach(rawOption => {
                            options.push(new ElementOption(rawOption.name, rawOption.codename));
                        });
                    }

                    elements.push(new Element(elementCodename, typeElement.type, typeElement.name, taxonomyGroup, options));
                });
            }
        }
        return new ContentType(typeSystem, elements);
    }

    mapSingleType(response: CloudTypeResponseInterfaces.ICloudSingleTypeResponse): ContentType {
        return this.mapType(response as IContentType);
    }

    mapMultipleTypes(response: CloudTypeResponseInterfaces.ICloudMultipleTypeResponse): ContentType[] {
        var that = this;
        return response.types.map(function (type) {
            return that.mapType(type);
        });
    }
}