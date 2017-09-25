import { ILink } from '../../interfaces/item/ilink.interface';

export class Link implements ILink {
    constructor(
        /**
         * Id of the content item 
         */
        public itemId: string,

        /**
         * Codename of the content item
         */
        public codename: string,

        /**
         * Type codename of the content item
         */
        public type: string,

        /**
         * Url slug defined for the content item
         */
        public url_slug: string
    ){}
}