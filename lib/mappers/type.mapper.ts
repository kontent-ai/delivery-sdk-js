import { Contracts } from '../contracts';
import { IContentType, IContentTypeSystemAttributes, IGenericElement } from '../models';

export class TypeMapper<TContentTypeCodenames extends string> {
    mapSingleType(response: Contracts.IViewContentTypeContract): IContentType<TContentTypeCodenames> {
        return this.mapType(response);
    }

    mapMultipleTypes(response: Contracts.IListContentTypeContract): IContentType<TContentTypeCodenames>[] {
        return response.types.map((type) => {
            return this.mapType(type);
        });
    }

    private mapType(type: Contracts.IContentTypeContract): IContentType<TContentTypeCodenames> {
        if (!type) {
            throw Error(`Cannot map type`);
        }

        if (!type.elements) {
            throw Error(`Cannot map type elements`);
        }

        const system: IContentTypeSystemAttributes<TContentTypeCodenames> = {
            codename: type.system.codename as TContentTypeCodenames,
            id: type.system.id,
            name: type.system.name,
            lastModified: type.system.last_modified
        };

        const elements: IGenericElement[] = [];

        const elementNames = Object.getOwnPropertyNames(type.elements);
        elementNames.forEach((elementName: string) => {
            const typeElement = type.elements[elementName];

            if (!typeElement) {
                throw Error(`Cannot find element '${elementName}' on type '${type.system.codename}'`);
            }

            // use json property as a codename of the type element
            const elementCodename = elementName;

            // extra properties for certain element types
            const options: Contracts.IElementOptionContract[] = [];

            // some elements can contain options
            const rawOptions = typeElement.options;
            if (rawOptions) {
                if (!Array.isArray(rawOptions)) {
                    throw Error(`Content type 'options' property has to be an array`);
                }

                rawOptions.forEach((rawOption) => {
                    options.push({
                        codename: rawOption.codename,
                        name: rawOption.name
                    });
                });
            }

            elements.push({
                codename: elementCodename,
                taxonomyGroup: typeElement.taxonomy_group,
                options: options,
                name: typeElement.name,
                type: typeElement.type
            });
        });

        return {
            elements: elements,
            system: system
        };
    }
}
