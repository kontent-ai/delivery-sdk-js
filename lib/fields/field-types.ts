import { FieldType } from './field-type';
import { IField } from '../interfaces/item/ifield.interface';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { IAsset, IMultipleChoiceOption } from './field-interfaces';
import { AssetModel, MultipleChoiceOption } from './field-models';

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
    * Text stored in the field
    */
    public text: string;

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
    */
    constructor(
        public name: string,
        public type: FieldType,
        public value: any,
        public modularItems: IContentItem[]
    ) {
        this.text = value;
        this.items = modularItems;
    };
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
