import { Pagination } from '../common';
import { ICloudResponse, ICloudResponseDebug } from '../common/common-models';
import { ContentType } from './content-type-models';

export namespace TypeResponses {

    export class ViewContentTypeResponse implements ICloudResponse {

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

    export class ListContentTypesResponse implements ICloudResponse {

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
