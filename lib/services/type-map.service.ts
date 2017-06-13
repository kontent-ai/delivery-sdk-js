import { ICloudMultipleTypeResponse, ICloudSingleTypeResponse } from '../interfaces/type/cloud-responses';
import { IContentType } from '../interfaces/type/icontent-type.interface';
import { ContentType } from '../models/type/content-type.class';
import { ContentTypeSystemAttributes } from '../models/type/content-type-system-attributes.class';
import { ContentTypeElement } from '../models/type/content-type-element.class';
import { IContentTypeElement } from '../interfaces/type/icontent-type-element.interface';
import { DeliveryClientConfig } from '../config/delivery-client.config';

export class TypeMapService {

    constructor(
        private deliveryClientConfig: DeliveryClientConfig
    ) {
    }

    private mapType(type: IContentType): ContentType {
        if (!type) {
            return null;
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
                    var typeElement = type.elements[elementName] as IContentTypeElement;

                    if (!typeElement) {
                        throw Error(`Cannot find element '${elementName}' on type '${type}'`);
                    }
                    elements.push(new ContentTypeElement(typeElement.type, typeElement.name));
                });
            }
        }
        return new ContentType(typeSystem, elements);
    }

    mapSingleType(response: ICloudSingleTypeResponse): ContentType {
        return this.mapType(response as IContentType);
    }

    mapMultipleTypes(response: ICloudMultipleTypeResponse): ContentType[] {
        var that = this;
        return response.types.map(function (type) {
            return that.mapType(type);
        });
    }
}