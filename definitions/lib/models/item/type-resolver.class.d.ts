import { IItem } from '../../interfaces/item/iitem.interface';
export declare class TypeResolver {
    type: string;
    resolve: () => IItem;
    constructor(type: string, resolve: () => IItem);
}
