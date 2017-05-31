import { IType } from '../../interfaces/type/itype.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';
export declare class MultipleTypeResponse {
    types: IType[];
    pagination: IPagination;
    constructor(types: IType[], pagination: IPagination);
}
export declare class SingleTypeResponse {
    type: IType;
    constructor(type: IType);
}
