import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';
import { ICloudResponse } from '../../interfaces/common/icloud-response.interface';
import { Pagination } from '../common';
import { ContentType } from './content-type.class';

export namespace TypeResponses {

    export class DeliveryTypeListingResponse implements ICloudResponse {

        /**
        * Response containing multiple types
        * @constructor
        * @param {IContentType[]} types - Content types
        * @param {Pagination} pagination - Pagination object
        */
        constructor(
            public types: ContentType[],
            public pagination: Pagination,
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
            public type: ContentType,
            public debug: ICloudResponseDebug
        ) { }
    }
}
