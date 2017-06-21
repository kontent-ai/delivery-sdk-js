import { IContentItemSystemAttributes } from '../../interfaces/item/icontent-item-system-attributes.interface';

export class ContentItemSystemAttributes implements IContentItemSystemAttributes {
    constructor(
        public id: string,
        public name: string,
        public codename: string,
        public type: string,
        public last_modified: Date,
        public language: string,
        public sitemap_locations: string[]
    ) { }
}

