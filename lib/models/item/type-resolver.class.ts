import { IContentItem } from '../../interfaces/item/icontent-item.interface';

export class TypeResolver {
    constructor(
        public type: string,
        public resolve: () => IContentItem
    ) { }
}