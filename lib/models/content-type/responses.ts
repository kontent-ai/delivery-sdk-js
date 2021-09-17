
import {
    IKontentListAllResponse,
    IKontentListResponse,
    IKontentNetworkResponse,
    IKontentResponse,
    Pagination
} from '../common';
import { ContentType } from './content-type-models';

export namespace TypeResponses {
    export class ListContentTypesResponse implements IKontentListResponse {
        /**
         * Response containing multiple types
         * @constructor
         * @param {IContentType[]} items - Content types
         * @param {Pagination} pagination - Pagination object
         */
        constructor(public items: ContentType[], public pagination: Pagination) {
        }
    }

    export class ListContentTypesAllResponse implements IKontentListAllResponse {
        constructor(public items: ContentType[], public responses: IKontentNetworkResponse<ListContentTypesResponse>[]) {
        }
    }

    export class ViewContentTypeResponse implements IKontentResponse {
        /**
         * Response containing single type
         * @constructor
         * @param {IContentType} type - Content type
         */
        constructor(public type: ContentType) {
        }
    }
}
