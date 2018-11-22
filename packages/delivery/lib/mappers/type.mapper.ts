import { ElementContracts, IElementOptionContract, TypeContracts } from '../data-contracts';
import { ContentType, ContentTypeSystemAttributes, Element, ElementOption } from '../models';

export class TypeMapper {

    mapSingleType(response: TypeContracts.ITypeResponseContract): ContentType {
        return this.mapType(response);
    }

    mapMultipleTypes(response: TypeContracts.ITypesResponseContract): ContentType[] {
        const that = this;
        return response.types.map(function (type) {
            return that.mapType(type);
        });
    }

    private mapType(type: TypeContracts.IContentTypeContract): ContentType {
        if (!type) {
            throw Error(`Cannot map type`);
        }

        if (!type.elements) {
            throw Error(`Cannot map type elements`);
        }

        const typeSystem = new ContentTypeSystemAttributes({
            codename: type.system.codename,
            id: type.system.id,
            name: type.system.name,
            lastModified: type.system.last_modified
        });

        const elements: Element[] = [];

        const elementNames = Object.getOwnPropertyNames(type.elements);
        elementNames.forEach((elementName: string) => {
            const typeElement = type.elements[elementName] as ElementContracts.IElementResponseContract;

            if (!typeElement) {
                throw Error(`Cannot find element '${elementName}' on type '${type}'`);
            }

            // use json property as a codename of the type element
            const elementCodename = elementName;

            // extra properties for certain field types
            const taxonomyGroup: string | undefined = typeElement.taxonomy_group;
            const options: IElementOptionContract[] = [];

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

            elements.push(new Element({
                codename: elementCodename,
                taxonomyGroup: taxonomyGroup,
                options: options,
                name: typeElement.name,
                type: typeElement.type
            }));
        });
        return new ContentType({
            system: typeSystem,
            elements: elements
        });
    }

}
