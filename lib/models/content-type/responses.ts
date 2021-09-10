import { IResponse } from '@kentico/kontent-core';

import {
    BaseGroupedKontentResponse,
    BaseKontentResponse,
    IKontentListAllResponse,
    IKontentListResponse,
    Pagination
} from '../common';
import { ContentType } from './content-type-models';

export namespace TypeResponses {
    export class ListContentTypesResponse extends BaseKontentResponse implements IKontentListResponse {
        /**
         * Response containing multiple types
         * @constructor
         * @param {IContentType[]} items - Content types
         * @param {Pagination} pagination - Pagination object
         */
        constructor(public items: ContentType[], public pagination: Pagination, response: IResponse<any>) {
            super(response);
        }
    }

    export class ListContentTypesAllResponse extends BaseGroupedKontentResponse implements IKontentListAllResponse {
        constructor(public items: ContentType[], public responses: ListContentTypesResponse[]) {
            super(responses);
        }
    }

    export class ViewContentTypeResponse extends BaseKontentResponse {
        /**
         * Response containing single type
         * @constructor
         * @param {IContentType} type - Content type
         */
        constructor(public type: ContentType, response: IResponse<any>) {
            super(response);
        }
    }
}
