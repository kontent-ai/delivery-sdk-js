import { IItem } from '../../interfaces/item/iitem.interface';

export class TypeResolver {
    constructor(
        public type: string,
        public resolve: () => IItem
    ) { }
}