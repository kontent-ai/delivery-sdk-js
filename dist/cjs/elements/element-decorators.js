"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementDecorators = void 0;
require("reflect-metadata");
var ElementDecorators;
(function (ElementDecorators) {
    const codenameMetadataKey = Symbol('codename');
    const generateKey = (name) => `${codenameMetadataKey.toString()}:${name}`;
    /**
     * Get the metadata entry saved by the decorator
     * @param target - object instance
     * @param elementName - Element name (code name from Kentico Kontent)
     */
    function getPropertyName(target, elementName) {
        return Reflect.getMetadata(generateKey(elementName), target);
    }
    ElementDecorators.getPropertyName = getPropertyName;
    /**
     * Decorator - creates metadata entry for the @target - Value is the property name.
     * This will then be retrieved when resolving the element name
     * @param value - Element code name
     */
    function codename(value) {
        return function (target, propertyKey) {
            Reflect.defineMetadata(generateKey(value), propertyKey, target);
        };
    }
    ElementDecorators.codename = codename;
})(ElementDecorators = exports.ElementDecorators || (exports.ElementDecorators = {}));
//# sourceMappingURL=element-decorators.js.map