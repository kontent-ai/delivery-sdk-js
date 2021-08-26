import { IResponse } from '@kentico/kontent-core';

import { BaseKontentResponseStandardDebug, Pagination } from '../common';
import { ContentType } from './content-type-models';

export namespace TypeResponses {
    export class ListContentTypesResponse extends BaseKontentResponseStandardDebug {
        /**
         * Response containing multiple types
         * @constructor
         * @param {IContentType[]} types - Content types
         * @param {Pagination} pagination - Pagination object
         */
        constructor(public types: ContentType[], public pagination: Pagination, response: IResponse<any>) {
            super(response);
        }
    }

    export class ViewContentTypeResponse extends BaseKontentResponseStandardDebug {
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
