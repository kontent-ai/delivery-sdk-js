import { Pagination } from '../common';
import { IKontentResponse, IKontentResponseDebug } from '../common/common-models';
import { ContentType } from './content-type-models';

export namespace TypeResponses {

    export class ListContentTypesResponse implements IKontentResponse {

        /**
        * Response containing multiple types
        * @constructor
        * @param {IContentType[]} types - Content types
        * @param {Pagination} pagination - Pagination object
        */
        constructor(
            public types: ContentType[],
            public pagination: Pagination,
            public debug: IKontentResponseDebug
        ) { }
    }

    export class ViewContentTypeResponse implements IKontentResponse {

        /**
        * Response containing single type
        * @constructor
        * @param {IContentType} type - Content type
        */
        constructor(
            public type: ContentType,
            public debug: IKontentResponseDebug
        ) { }
    }
}
