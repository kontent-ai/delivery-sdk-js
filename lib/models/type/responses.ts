import { IContentType } from '../../interfaces/type/icontent-type.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';

export class DeliveryTypeListingResponse {
    constructor(
        public types: IContentType[],
        public pagination: IPagination
    ) { }
}

export class DeliveryTypeResponse {
    constructor(
        public type: IContentType
    ) { }
}