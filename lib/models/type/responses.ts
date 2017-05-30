import { ICloudMultipleTypeResponse, ICloudSingleTypeResponse } from '../../interfaces/type/cloud-responses';
import { IType } from '../../interfaces/type/itype.interface';
import { ITypeElement } from '../../interfaces/type/itype-element.interface';
import { ISystemType } from '../../interfaces/type/isystem-type.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';

export class MultipleTypeResponse implements ICloudMultipleTypeResponse {
    constructor(
        public types: IType[],
        public pagination: IPagination
    ) { }
}

export class SingleTypeResponse implements ICloudSingleTypeResponse {
    constructor(
        public system: ISystemType,
        public elements: ITypeElement[]
    ) { }
}