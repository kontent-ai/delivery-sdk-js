"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericElementMapper = void 0;
const models_1 = require("../models");
class GenericElementMapper {
    mapElement(response) {
        if (!response) {
            throw Error(`Invalid response for mapping element`);
        }
        return new models_1.GenericElement({
            codename: response.codename,
            name: response.name,
            type: response.type,
            options: response.options ? response.options : [],
            taxonomyGroup: response.taxonomy_group
        });
    }
}
exports.GenericElementMapper = GenericElementMapper;
//# sourceMappingURL=generic-element.mapper.js.map