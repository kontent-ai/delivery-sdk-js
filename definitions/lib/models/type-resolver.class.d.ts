import { IItem } from '../interfaces/iitem.interface';
export declare class TypeResolver {
    type: string;
    resolve: () => IItem;
    constructor(type: string, resolve: () => IItem);
}
