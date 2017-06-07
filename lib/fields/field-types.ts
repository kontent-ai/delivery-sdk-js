import { FieldType } from './field-type';
import { IField } from '../interfaces/item/ifield.interface';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { IAsset, IMultipleChoiceOption } from './field-interfaces';
import { AssetModel, MultipleChoiceOption } from './field-models';
import { Parse5Attribute, Parse5Node } from './internal-models';

// parse5 for parsing HTML
import * as parse5 from 'parse5';

export class TextField implements IField {

    /**
    * Text stored in the field
    */
    public text: string;

    /**
    * Represents text field of Kentico Cloud item
    * @constructor
    * @param {string} name - Name of the field
    * @param {FieldType} type - Type of the field
    * @param {string} value - Value of the field
    */
    constructor(
        public name: string,
        public type: FieldType,
        public value: any
    ) {
        this.text = this.value;
    };
}


export class MultipleChoiceField implements IField {

    /**
    * Multiple choice options
    */
    public options: MultipleChoiceOption[] = [];

    /**
    * Represents multiple choice field of Kentico Cloud item
    * @constructor
    * @param {string} name - Name of the field
    * @param {FieldType} type - Type of the field
    * @param {string} value - Value of the field
    */
    constructor(
        public name: string,
        public type: FieldType,
        public value: any
    ) {
        if (this.value) {
            if (Array.isArray(this.value)) {
                this.value.forEach(option => {
                    var optionTemp = option as IMultipleChoiceOption;
                    this.options.push(new MultipleChoiceOption(
                        optionTemp.name,
                        optionTemp.codename
                    ));
                });
            }
        }
    };
}


export class DateTimeField implements IField {

    /**
    * Date time value
    */
    public datetime: Date;

    /**
    * Represents date time field of Kentico Cloud item
    * @constructor
    * @param {string} name - Name of the field
    * @param {FieldType} type - Type of the field
    * @param {string} value - Value of the field
    */
    constructor(
        public name: string,
        public type: FieldType,
        public value: any
    ) {
        this.datetime = new Date(value);
    };
}

export class RichTextField implements IField {

    /**
     * Type identifying nested modular content in Rich text fields
     */
    private readonly objectType = 'application/kenticocloud';

    /**
     * This tag wil be used instead of 'object'
     */
    private readonly modularContentTagWrapper = 'div';

    /**
     * Attribute used to identify modular item based on its codename
     */
    private readonly codenameAttributeName = 'data-codename';

    /**
    * Html stored in the field. Does not contain resolved modular content. Use 'getHtml' method to get html with resolved modular content.
    */
    private html: string;

    /**
     * Resolved html in field - store here once the html was resolved to avoid resolving it multiple times
     */
    private resolvedHtml: string;

    /**
    * List of modular content items used in this rich text field
    */
    public items: IContentItem[] = [];

    /**
    * Represents rich text field of Kentico Cloud item
    * @constructor
    * @param {string} name - Name of the field
    * @param {FieldType} type - Type of the field
    * @param {string} value - Value of the field
    * @param {boolean} enableAdvancedLogging - Indicates if advanced issues are logged in console
    */
    constructor(
        public name: string,
        public type: FieldType,
        public value: any,
        public modularItems: IContentItem[],
        public enableAdvancedLogging: boolean
    ) {
        this.html = value;
        this.items = modularItems;
    };

    /**
     * Resolves modular content inside the Rich text field. 
     * Rich text resolved needs to be configured either on the model or query level
     */
    getHtml(): string {
        // resolve modular content nested within the rich text field 
        // find the all 'object' tags
        // example: <object type="application/kenticocloud" data-type="item" data-codename="geralt"></object>

        // check if html was already resolved
        if (this.resolvedHtml){
            return this.resolvedHtml;
        }

        var documentFragment = parse5.parseFragment(this.html) as any;

        // recursively process all child nodes
        this.processChildNodes(documentFragment.childNodes as Parse5Node[]);

        // serliaze document go get string as HTML
        var resolvedHtml = parse5.serialize(documentFragment);

        // set resolved html
        this.resolvedHtml = resolvedHtml;

        return resolvedHtml;
    }

    private processChildNodes(childNodes: Parse5Node[]): void {
        if (childNodes) {
            if (!Array.isArray(childNodes)) {
                throw `Cannot process modular content in 'RichTextField' because child nodes is not an array`;
            }

            childNodes.forEach(node => {
                if (!node.attrs) {
                    // recursively process all nodes
                    if (node.childNodes) {
                        return this.processChildNodes(node.childNodes);
                    }
                    return this.processChildNodes(null);
                }

                var attributes = node.attrs as Parse5Attribute[]; // array of attributes => name/value pair
                var modularContentAttribute = attributes.find(m => m.value === this.objectType && m.name === 'type');
                if (!modularContentAttribute) {
                    return null;
                }

                // get codename of the modular content
                var modularItemCodenameAttribute = attributes.find(m => m.name === this.codenameAttributeName);
                if (!modularItemCodenameAttribute) {
                    throw null;
                }

                // get modular content item
                var modularContentItem = this.modularItems.find(m => m.system.codename === modularItemCodenameAttribute.value);

                // check if modular content really exists
                if (!modularContentItem) {
                    throw `Cannot resolve modular content in 'RichTextField' for '${modularItemCodenameAttribute.value}' content item`
                }

                // replace 'object' tag name
                node.tagName = this.modularContentTagWrapper;

                // get html to replace object using Rich text resolver function
                // check if such function exists first
                if (!modularContentItem.richTextModularResolver) {
                    if (this.enableAdvancedLogging) {
                        console.log(`Cannot resolve modular content of '${modularContentItem.system.type}' type in 'RichTextField' because no rich text resolved was configured`);
                    }

                    return null;
                }

                var replaceHtml = modularContentItem.richTextModularResolver(modularContentItem);

                var serializedHtml = parse5.parseFragment(replaceHtml) as any;

                // add replaced html to node
                node.childNodes = serializedHtml.childNodes as Parse5Node[];
            });
        }
    }
}

export class NumberField implements IField {

    /**
    * Number value of this field
    */
    public number: number;

    /**
    * Represents number field of Kentico Cloud item
    * @constructor
    * @param {string} name - Name of the field
    * @param {FieldType} type - Type of the field
    * @param {string} value - Value of the field
    */
    constructor(
        public name: string,
        public type: FieldType,
        public value: any
    ) {
        this.number = value;
    };
}

export class AssetsField implements IField {

    /**
    * List of assets used in this field
    */
    public assets: AssetModel[] = [];

    /**
    * Represents asset field of Kentico Cloud item
    * @constructor
    * @param {string} name - Name of the field
    * @param {FieldType} type - Type of the field
    * @param {string} value - Value of the field
    */
    constructor(
        public name: string,
        public type: FieldType,
        public value: any
    ) {
        if (this.value) {
            if (Array.isArray(this.value)) {
                this.value.forEach(asset => {
                    var assetTemp = asset as IAsset;
                    this.assets.push(new AssetModel(
                        assetTemp.name,
                        assetTemp.type,
                        assetTemp.size,
                        assetTemp.description,
                        assetTemp.url
                    ));
                });
            }
        }
    };
}

export class UrlSlugField implements IField {

    /**
    * Resolved Url of the item
    */
    public url: string;

    /**
    * Represents URL slug field of Kentico Cloud item
    * @constructor
    * @param {string} name - Name of the field
    * @param {FieldType} type - Type of the field
    * @param {string} value - Value of the field
    * @param {string} contentItemType - Type of the content item
    * @param {(contentItem: IContentItem, urlSlug: string) => string} urlSlugResolver - Callback used to resolve URL slug of the item with type
    * @param {boolean} enableAdvancedLogging - Indicates if advanced issues are logged in console
    */
    constructor(
        public name: string,
        public type: FieldType,
        public value: string,
        public contentItem: IContentItem,
        public urlSlugResolver: (contentItem: IContentItem, urlSlug: string) => string,
        public enableAdvancedLogging: boolean
    ) {
        this.url = this.getUrl();
    };

    private getUrl(): string {
        if (!this.urlSlugResolver) {
            throw `You have to implement 'urlSlugResolver' in your Model class or your query in order to get url of this item`;
        }

        var url = this.urlSlugResolver(this.contentItem, this.value);

        if (!url && this.enableAdvancedLogging) {
            console.log(`'urlSlugResolver' is configured, but url resolved for '${this.contentItem.system.type}' type is empty`);
        }

        return url;
    }
}
