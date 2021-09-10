import { IResponse } from '@kentico/kontent-core';

import {
    BaseGroupedKontentResponse,
    BaseKontentResponse,
    IKontentListAllResponse,
    IKontentListResponse,
    Pagination
} from '../common';
import { TaxonomyGroup } from './taxonomy-models';

export namespace TaxonomyResponses {
    export class ViewTaxonomyResponse extends BaseKontentResponse {
        constructor(
            /**
             * Taxonomy group
             */
            public taxonomy: TaxonomyGroup,

            /**
             * Response
             */
            response: IResponse<any>
        ) {
            super(response);
        }
    }

    export class ListTaxonomiesResponse extends BaseKontentResponse implements IKontentListResponse {
        constructor(
            /**
             * Taxonomies
             */
            public items: TaxonomyGroup[],

            /**
             * Pagination
             */
            public pagination: Pagination,

            /**
             * Response
             */
            response: IResponse<any>
        ) {
            super(response);
        }
    }

    export class ListTaxonomiesAllResponse extends BaseGroupedKontentResponse implements IKontentListAllResponse {
        constructor(public items: TaxonomyGroup[], public responses: ListTaxonomiesResponse[]) {
            super(responses);
        }
    }
}
