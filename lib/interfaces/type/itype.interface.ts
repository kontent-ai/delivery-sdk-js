import { ISystemType } from './isystem-type.interface';
import { ITypeElement } from './itype-element.interface';

export interface IType {
    system: ISystemType;
    elements: ITypeElement[]
}