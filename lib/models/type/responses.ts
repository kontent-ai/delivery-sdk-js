import { IContentType } from '../../interfaces/type/icontent-type.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';
import { ICloudResponse } from '../../interfaces/common/icloud-response.interface';
import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';

export namespace TypeResponses {

    export class DeliveryTypeListingResponse implements ICloudResponse {

        /**
        * Response containing multiple types
        * @constructor
        * @param {IContentType[]} types - Content types
        * @param {IPagination} pagination - Pagination object
        */
        constructor(
            public types: IContentType[],
            public pagination: IPagination,
            public debug: ICloudResponseDebug
        ) { }
    }

    export class DeliveryTypeResponse implements ICloudResponse {

        /**
        * Response containing single type
        * @constructor
        * @param {IContentType} type - Content type
        */
        constructor(
            public type: IContentType,
            public debug: ICloudResponseDebug
        ) { }
    }
}
