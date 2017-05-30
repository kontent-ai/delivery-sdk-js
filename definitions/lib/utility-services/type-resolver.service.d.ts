import { TypeResolver } from '../models/type-resolver.class';
import { IItem } from '../interfaces/iitem.interface';
export declare class TypeResolverService {
    private typeResolvers;
    constructor(typeResolvers: TypeResolver[]);
    createTypedObj<TItem extends IItem>(type: string, item: IItem): TItem;
}
