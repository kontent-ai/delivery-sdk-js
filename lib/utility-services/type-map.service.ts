import { ICloudMultipleTypeResponse, ICloudSingleTypeResponse } from '../interfaces/type/cloud-responses';
import { IQueryOption } from '../interfaces/common/iquery-option.interface';
import { IType } from '../interfaces/type/itype.interface';
import { Type } from '../models/type/type.class';
import { MultipleTypeResponse, SingleTypeResponse } from '../models/type/responses';
import { TypeSystem } from '../models/type/system-type.class';
import { TypeElement } from '../models/type/type-element.class';
import { ITypeElement } from '../interfaces/type/itype-element.interface';

export class TypeMapService {

    constructor(
    ) {
    }

    private mapType(type: IType): Type {
        if (!type) {
            return null;
        }

        var typeSystem = new TypeSystem(
            type.system.id,
            type.system.name,
            type.system.codename,
            type.system.last_modified
        );

        var elements: TypeElement[] = [];

        if (type.elements) {
            var elementNames = Object.getOwnPropertyNames(type.elements);
            if (elementNames) {
                elementNames.forEach(elementName => {
                    var typeElement = type.elements[elementName] as ITypeElement;

                    if (!typeElement) {
                        throw `Cannot find element '${elementName}' on type '${type}'`;
                    }
                    elements.push(new TypeElement(typeElement.type, typeElement.name));
                });
            }
        }
        return new Type(typeSystem, elements);
    }

    mapSingleType(response: ICloudSingleTypeResponse): Type {
        return this.mapType(response as IType);
    }

    mapMultipleTypes(response: ICloudMultipleTypeResponse): Type[] {
        var that = this;
        return response.types.map(function (type) {
            return that.mapType(type);
        });
    }
}