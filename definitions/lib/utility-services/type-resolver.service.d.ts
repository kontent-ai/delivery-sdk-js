import { TypeResolver } from '../models/item/type-resolver.class';
import { IItem } from '../interfaces/item/iitem.interface';
export declare class TypeResolverService {
    private typeResolvers;
    constructor(typeResolvers: TypeResolver[]);
    createTypedObj<TItem extends IItem>(type: string, item: IItem): TItem;
}
