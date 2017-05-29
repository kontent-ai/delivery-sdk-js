import { IItem } from '../interfaces/iitem.interface';

export class TypeResolver {
    constructor(
        public type: string,
        public resolve: () => IItem
    ) { }
}