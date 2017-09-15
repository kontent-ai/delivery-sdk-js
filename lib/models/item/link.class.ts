import { ILink } from '../../interfaces/item/ilink.interface';

export class Link implements ILink {
    constructor(
        public itemId: string,
        public codename: string,
        public type: string,
        public url_slug: string
    ){}
}