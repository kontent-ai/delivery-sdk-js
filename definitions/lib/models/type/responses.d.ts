import { ICloudMultipleTypeResponse, ICloudSingleTypeResponse } from '../../interfaces/type/cloud-responses';
import { IType } from '../../interfaces/type/itype.interface';
import { ITypeElement } from '../../interfaces/type/itype-element.interface';
import { ISystemType } from '../../interfaces/type/isystem-type.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';
export declare class MultipleTypeResponse implements ICloudMultipleTypeResponse {
    types: IType[];
    pagination: IPagination;
    constructor(types: IType[], pagination: IPagination);
}
export declare class SingleTypeResponse implements ICloudSingleTypeResponse {
    system: ISystemType;
    elements: ITypeElement[];
    constructor(system: ISystemType, elements: ITypeElement[]);
}
