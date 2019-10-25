import { IBaseResponse } from '@kentico/kontent-core';

import { BaseKontentResponseStandardDebug, Pagination } from '../common';
import { TaxonomyGroup } from './taxonomy-models';

export namespace TaxonomyResponses {
    export class ViewTaxonomyGroupResponse extends BaseKontentResponseStandardDebug {
        constructor(
            /**
             * Taxonomy group
             */
            public taxonomy: TaxonomyGroup,

            /**
             * Response
             */
            response: IBaseResponse<any>,
            isDeveloperMode: boolean
        ) {
            super(response, isDeveloperMode);
        }
    }

    export class ListTaxonomyGroupsResponse extends BaseKontentResponseStandardDebug {
        constructor(
            /**
             * Taxonomies
             */
            public taxonomies: TaxonomyGroup[],

            /**
             * Pagination
             */
            public pagination: Pagination,

            /**
             * Response
             */
            response: IBaseResponse<any>,
            isDeveloperMode: boolean
        ) {
            super(response, isDeveloperMode);
        }
    }
}
