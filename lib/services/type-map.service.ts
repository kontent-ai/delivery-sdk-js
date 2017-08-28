import { CloudTypeResponseInterfaces } from '../interfaces/type/cloud-responses';
import { IContentType } from '../interfaces/type/icontent-type.interface';
import { ContentType } from '../models/type/content-type.class';
import { ContentTypeSystemAttributes } from '../models/type/content-type-system-attributes.class';
import { ContentTypeElement } from '../models/type/content-type-element.class';
import { ContentTypeOption } from '../models/type/content-type-option.class';
import { IContentTypeElement } from '../interfaces/type/icontent-type-element.interface';
import { IContentTypeOption } from '../interfaces/type/icontent-type-option.interface';
import { DeliveryClientConfig } from '../config/delivery-client.config';

export class TypeMapService {

    constructor(
        private deliveryClientConfig: DeliveryClientConfig
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

        var elements: ContentTypeElement[] = [];

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
                    var options: IContentTypeOption[] = [];

                    // some elements can contain options
                    var rawOptions = typeElement.options;
                    if (rawOptions){
                        if (!Array.isArray(rawOptions)){
                            throw Error(`Content type 'options' property has to be an array`);
                        }

                        rawOptions.forEach(rawOption => {
                            options.push(new ContentTypeOption(rawOption.name, rawOption.codename));
                        });
                    }

                    elements.push(new ContentTypeElement(elementCodename, typeElement.type, typeElement.name, taxonomyGroup, options));
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