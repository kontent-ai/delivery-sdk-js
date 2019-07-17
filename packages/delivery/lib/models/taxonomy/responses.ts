import { ICloudResponse, ICloudResponseDebug, Pagination } from '../common';
import { TaxonomyGroup } from './taxonomy-models';

export namespace TaxonomyResponses {

    export class ViewTaxonomyGroupResponse implements ICloudResponse {
        constructor(
            /**
             * Taxonomy group
             */
            public taxonomy: TaxonomyGroup,

            /**
             * Debug information
             */
            public debug: ICloudResponseDebug
        ) {
        }
    }

    export class ListTaxonomyGroupsResponse implements ICloudResponse {
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
            public debug: ICloudResponseDebug
        ) {
        }
    }
}
