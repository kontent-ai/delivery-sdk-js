import { IType } from '../../interfaces/type/itype.interface';
import { ISystemType } from '../../interfaces/type/isystem-type.interface';
import { ITypeElement } from '../../interfaces/type/itype-element.interface';
export declare class Type implements IType {
    system: ISystemType;
    elements: ITypeElement[];
    constructor(system: ISystemType, elements: ITypeElement[]);
}
