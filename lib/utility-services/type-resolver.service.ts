import { TypeResolver } from '../models/item/type-resolver.class';
import { IItem } from '../interfaces/item/iitem.interface';
import { SystemItem } from '../models/item/system-item.class';

export class TypeResolverService {

    constructor(
        private typeResolvers: TypeResolver[]
    ) {
    }

    createTypedObj<TItem extends IItem>(type: string, item: IItem): TItem {
        if (!type) {
            throw Error('Cannot resolve type because no type name was provided');
        }

        var typeResolver = this.typeResolvers.find(m => m.type === type);

        if (!typeResolver) {
            throw Error(`Cannot find resolver for type '${type}'`);
        }

        var typedItem = typeResolver.resolve() as TItem;

        // use typed 'system' property
        typedItem.system = new SystemItem(
            item.system.id,
            item.system.name,
            item.system.codename,
            item.system.type,
            item.system.last_modified
        );

        return typedItem;
    }
}