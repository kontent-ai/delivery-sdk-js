"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichTextItemDataType = exports.RichTextImage = exports.Link = exports.ContentItemSystemAttributes = exports.ContentItem = void 0;
const elements_1 = require("../../elements/elements");
class ContentItem {
    /**
    * Base class representing content item type. All content type models need to extend this class.
    * @constructor
    */
    constructor(config) {
        this._config = config;
    }
    /**
     * Gets array of all elements assigned to content item.
     * This is an alternative to accessing elements via properties.
     */
    getAllElements() {
        const elements = [];
        // get all props
        for (const key of Object.keys(this)) {
            const prop = this[key];
            if (prop instanceof elements_1.Elements.BaseElement) {
                elements.push(prop);
            }
        }
        return elements;
    }
}
exports.ContentItem = ContentItem;
class ContentItemSystemAttributes {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.ContentItemSystemAttributes = ContentItemSystemAttributes;
class Link {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.Link = Link;
class RichTextImage {
    constructor(data) {
        Object.assign(this, data);
    }
}
exports.RichTextImage = RichTextImage;
var RichTextItemDataType;
(function (RichTextItemDataType) {
    RichTextItemDataType["Item"] = "item";
})(RichTextItemDataType = exports.RichTextItemDataType || (exports.RichTextItemDataType = {}));
//# sourceMappingURL=item-models.js.map