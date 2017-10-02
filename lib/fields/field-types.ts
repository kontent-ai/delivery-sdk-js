import { FieldType } from './field-type';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { FieldInterfaces } from './field-interfaces';
import { FieldModels } from './field-models';
import { ILink } from '../interfaces/item/ilink.interface';
import { Link } from '../models/item/link.class';
import { RichTextResolver } from './rich-text-resolver.class';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { TypeResolverService } from '../services/type-resolver.service';

export namespace Fields {

    export class TextField implements FieldInterfaces.IField {

        /**
        * Text stored in the field
        */
        public text: string;

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.text;

        /**
        * Represents text field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            this.text = this.value;
        };
    }

    export class MultipleChoiceField implements FieldInterfaces.IField {

        /**
        * Multiple choice options
        */
        public options: FieldModels.MultipleChoiceOption[] = [];

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.multiple_choice;

        /**
        * Represents multiple choice field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            if (this.value && Array.isArray(this.value)) {
                this.value.forEach(option => {
                    var optionTemp = option as FieldInterfaces.IMultipleChoiceOption;
                    this.options.push(new FieldModels.MultipleChoiceOption(
                        optionTemp.name,
                        optionTemp.codename
                    ));
                });
            }
        };
    }


    export class DateTimeField implements FieldInterfaces.IField {

        /**
        * Date time value
        */
        public datetime: Date;

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.datetime;

        /**
        * Represents date time field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            this.datetime = new Date(value);
        };
    }

    export class RichTextField implements FieldInterfaces.IField {

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.rich_text;

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
        * @param {string} value - Value of the field
        * @param {IContentItem[]} modularItems - Modular items
        * @param {ILink[]} links - Links in rich text field
        * @param {TypeResolverService} typeResolverService - Type resolver service
        * @param {boolean} enableAdvancedLogging - Indicates if advanced issues are logged in console
        * @param {IItemQueryConfig} itemQueryConfig - Item query config
        */
        constructor(
            public name: string,
            public value: any,
            public modularItems: IContentItem[],
            public links: ILink[],
            public typeResolverService: TypeResolverService,
            public enableAdvancedLogging: boolean,
            public itemQueryConfig: IItemQueryConfig
        ) {
            this.items = modularItems;
        };

        getHtml(): string {
            // check if html was already resolved
            if (this.resolvedHtml) {
                return this.resolvedHtml;
            }

            var richTextHelper = new RichTextResolver(this.value, this.modularItems, this.links, this.typeResolverService, this.enableAdvancedLogging, this.itemQueryConfig)
            this.resolvedHtml = richTextHelper.resolveHtml();

            return this.resolvedHtml;
        }
    }

    export class NumberField implements FieldInterfaces.IField {

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.number;

        /**
        * Number value of this field
        */
        public number: number;

        /**
        * Represents number field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            this.number = value;
        };
    }

    export class AssetsField implements FieldInterfaces.IField {

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.asset;

        /**
        * List of assets used in this field
        */
        public assets: FieldModels.AssetModel[] = [];

        /**
        * Represents asset field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        */
        constructor(
            public name: string,
            public value: any
        ) {
            if (!value) {
                throw Error(`Cannot bind assets field because no value was provided`);
            }

            if (!Array.isArray(value)) {
                throw Error(`Cannot bind assets because the provided value is not an array`);
            }

            this.value.forEach(asset => {
                var assetTemp = asset as FieldInterfaces.IAsset;
                this.assets.push(new FieldModels.AssetModel(
                    assetTemp.name,
                    assetTemp.type,
                    assetTemp.size,
                    assetTemp.description,
                    assetTemp.url
                ));
            });
        };
    }

    export class UrlSlugField implements FieldInterfaces.IField {

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.url_slug;

        /**
        * Represents URL slug field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        * @param {IContentItem} item - Content item, required in order to get link object used by resolver
        * @param {((link: ILink) => string) | undefined} linkResolver - Callback used to resolve links
        * @param {boolean} enableAdvancedLogging - Indicates if advanced issues are logged in console
        */
        constructor(
            public name: string,
            public value: string,
            public item: IContentItem,
            public linkResolver: ((link: ILink) => string) | undefined,
            public enableAdvancedLogging: boolean
        ) {
        };

        getUrl(): string | null {
            if (!this.linkResolver) {
                if (this.enableAdvancedLogging) {
                    console.warn(`You have to implement 'linkResolver' in your Model class or your query in order to get url of this item`);
                }
                return null;
            }

            if (!this.item) {
                if (this.enableAdvancedLogging) {
                    console.warn(`Cannot resolve link for type '${this.type}' because source item is not valid`);
                }
                return null;
            }

            var url = this.linkResolver(new Link(
                this.item.system.id,
                this.item.system.codename,
                this.item.system.type,
                this.value
            ));

            if (!url) {
                console.warn(`'linkResolver' is configured, but url resolved for '${this.type}' type and '${this.name}' field resolved to an null/undefined value`);
                return null;
            }

            return url;
        }
    }

    export class TaxonomyField implements FieldInterfaces.IField {

        /**
        * Type of the field
        */
        public type: FieldType = FieldType.taxonomy;

        /**
        * List of assigned taxonomy terms
        */
        public taxonomyTerms: FieldModels.TaxonomyTerm[] = [];

        /**
        * Represents number field of Kentico Cloud item
        * @constructor
        * @param {string} name - Name of the field
        * @param {string} value - Value of the field
        * @param {string | undefined} taxonomyGroup - Codename of the taxonomy group
        */
        constructor(
            public name: string,
            public value: any,
            public taxonomyGroup: string | undefined
        ) {
            if (!value) {
                throw Error(`Cannot map taxonomy field because no value was provided`);
            }

            if (!Array.isArray(value)) {
                throw Error(`Cannot get taxonomy field because the provided value is not an array`);
            }

            var taxonomyList = value as FieldInterfaces.ITaxonomyTerm[];

            taxonomyList.forEach(term => {
                this.taxonomyTerms.push(new FieldModels.TaxonomyTerm(term.name, term.codename));
            });
        }
    };
}
