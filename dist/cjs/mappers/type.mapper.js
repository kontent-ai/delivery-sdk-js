"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeMapper = void 0;
const models_1 = require("../models");
class TypeMapper {
    mapSingleType(response) {
        return this.mapType(response);
    }
    mapMultipleTypes(response) {
        const that = this;
        return response.types.map(function (type) {
            return that.mapType(type);
        });
    }
    mapType(type) {
        if (!type) {
            throw Error(`Cannot map type`);
        }
        if (!type.elements) {
            throw Error(`Cannot map type elements`);
        }
        const typeSystem = new models_1.ContentTypeSystemAttributes({
            codename: type.system.codename,
            id: type.system.id,
            name: type.system.name,
            lastModified: type.system.last_modified
        });
        const elements = [];
        const elementNames = Object.getOwnPropertyNames(type.elements);
        elementNames.forEach((elementName) => {
            const typeElement = type.elements[elementName];
            if (!typeElement) {
                throw Error(`Cannot find element '${elementName}' on type '${type}'`);
            }
            // use json property as a codename of the type element
            const elementCodename = elementName;
            // extra properties for certain element types
            const taxonomyGroup = typeElement.taxonomy_group;
            const options = [];
            // some elements can contain options
            const rawOptions = typeElement.options;
            if (rawOptions) {
                if (!Array.isArray(rawOptions)) {
                    throw Error(`Content type 'options' property has to be an array`);
                }
                rawOptions.forEach(rawOption => {
                    options.push(new models_1.GenericElementOption(rawOption.name, rawOption.codename));
                });
            }
            elements.push(new models_1.GenericElement({
                codename: elementCodename,
                taxonomyGroup: taxonomyGroup,
                options: options,
                name: typeElement.name,
                type: typeElement.type
            }));
        });
        return new models_1.ContentType({
            system: typeSystem,
            elements: elements
        });
    }
}
exports.TypeMapper = TypeMapper;
//# sourceMappingURL=type.mapper.js.map