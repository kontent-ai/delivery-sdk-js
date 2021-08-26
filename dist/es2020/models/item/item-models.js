import { Elements } from '../../elements/elements';
export class ContentItem {
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
            if (prop instanceof Elements.BaseElement) {
                elements.push(prop);
            }
        }
        return elements;
    }
}
export class ContentItemSystemAttributes {
    constructor(data) {
        Object.assign(this, data);
    }
}
export class Link {
    constructor(data) {
        Object.assign(this, data);
    }
}
export class RichTextImage {
    constructor(data) {
        Object.assign(this, data);
    }
}
export var RichTextItemDataType;
(function (RichTextItemDataType) {
    RichTextItemDataType["Item"] = "item";
})(RichTextItemDataType || (RichTextItemDataType = {}));
//# sourceMappingURL=item-models.js.map