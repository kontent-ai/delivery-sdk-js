import { IContentItemSystemAttributes } from '../../interfaces/item/icontent-item-system-attributes.interface';

export class ContentItemSystemAttributes implements IContentItemSystemAttributes {
    constructor(
        /**
         * Id of the item
         */
        public id: string,

        /**
         * Name of the item
         */
        public name: string,

        /**
         * Codename of the item
         */
        public codename: string,

        /**
         * Codename of the type this item is using
         */
        public type: string,

        /**
         * Date when the item was last modified
         */
        public last_modified: Date,

        /**
         * Codename of the language
         */
        public language: string,

        /**
         * Array of sitemap locatoins
         */
        public sitemap_locations: string[]
    ) { }
}

