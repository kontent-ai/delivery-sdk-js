import { IKontentResponse, IKontentResponseDebug, Pagination } from '../common';
import { TaxonomyGroup } from './taxonomy-models';

export namespace TaxonomyResponses {

    export class ViewTaxonomyGroupResponse implements IKontentResponse {
        constructor(
            /**
             * Taxonomy group
             */
            public taxonomy: TaxonomyGroup,

            /**
             * Debug information
             */
            public debug: IKontentResponseDebug
        ) {
        }
    }

    export class ListTaxonomyGroupsResponse implements IKontentResponse {
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
             * Debug information
             */
            public debug: IKontentResponseDebug
        ) {
        }
    }
}
