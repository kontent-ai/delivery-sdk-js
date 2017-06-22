import { IContentType } from '../../interfaces/type/icontent-type.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';

export namespace TypeResponses {
    export class DeliveryTypeListingResponse {

        /**
        * Response containing multiple types 
        * @constructor
        * @param {IContentType[]} types - Content types
        * @param {IPagination} pagination - Pagination object
        */
        constructor(
            public types: IContentType[],
            public pagination: IPagination
        ) { }
    }

    export class DeliveryTypeResponse {

        /**
        * Response containing single type
        * @constructor
        * @param {IContentType} type - Content type
        */
        constructor(
            public type: IContentType
        ) { }
    }
}