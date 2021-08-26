import { IBaseResponse } from '@kentico/kontent-core';
import { BaseKontentResponseStandardDebug, Pagination } from '../common';
import { ContentType } from './content-type-models';
export declare namespace TypeResponses {
    class ListContentTypesResponse extends BaseKontentResponseStandardDebug {
        types: ContentType[];
        pagination: Pagination;
        /**
         * Response containing multiple types
         * @constructor
         * @param {IContentType[]} types - Content types
         * @param {Pagination} pagination - Pagination object
         */
        constructor(types: ContentType[], pagination: Pagination, response: IBaseResponse<any>, isDeveloperMode: boolean);
    }
    class ViewContentTypeResponse extends BaseKontentResponseStandardDebug {
        type: ContentType;
        /**
         * Response containing single type
         * @constructor
         * @param {IContentType} type - Content type
         */
        constructor(type: ContentType, response: IBaseResponse<any>, isDeveloperMode: boolean);
    }
}
