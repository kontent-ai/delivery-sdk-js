import { IType } from './itype.interface';
import { ISystemType } from './isystem-type.interface';
import { ITypeElement } from './itype-element.interface';
import { IPagination } from '../common/ipagination.interface';
export interface ICloudMultipleTypeResponse {
    types: IType[];
    pagination: IPagination;
}
export interface ICloudSingleTypeResponse {
    system: ISystemType;
    elements: ITypeElement[];
}
