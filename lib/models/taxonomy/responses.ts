import { IKontentListAllResponse, IKontentListResponse, IKontentNetworkResponse, IKontentResponse, Pagination } from '../common';
import { TaxonomyGroup } from './taxonomy-models';

export namespace TaxonomyResponses {
    export class ViewTaxonomyResponse implements IKontentResponse {
        constructor(
            /**
             * Taxonomy group
             */
            public taxonomy: TaxonomyGroup
        ) {}
    }

    export class ListTaxonomiesResponse implements IKontentListResponse {
        constructor(
            /**
             * Taxonomies
             */
            public items: TaxonomyGroup[],

            /**
             * Pagination
             */
            public pagination: Pagination
        ) {}
    }

    export class ListTaxonomiesAllResponse implements IKontentListAllResponse {
        constructor(public items: TaxonomyGroup[], public responses: IKontentNetworkResponse<ListTaxonomiesResponse>[]) {}
    }
}
