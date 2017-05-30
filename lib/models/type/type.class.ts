import { IType } from '../../interfaces/type/itype.interface';
import { ISystemType } from '../../interfaces/type/isystem-type.interface';
import { ITypeElement } from '../../interfaces/type/itype-element.interface';

export class Type implements IType {
    constructor(
        public system: ISystemType,
        public elements: ITypeElement[]
    ) { }
}