import { IType } from '../../interfaces/type/itype.interface';
import { ISystemType } from '../../interfaces/type/isystem-type.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';

export class MultipleTypeResponse {
    constructor(
        public types: IType[],
        public pagination: IPagination
    ) { }
}

export class SingleTypeResponse {
    constructor(
        public type: IType
    ) { }
}