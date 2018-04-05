import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';
import { ICloudResponse } from '../../interfaces/common/icloud-response.interface';
import { TaxonomyGroup } from './taxonomy-group.class';
import { Pagination } from '../common';

export namespace TaxonomyResponses {

    export class TaxonomyResponse implements ICloudResponse {
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

    export class TaxonomiesResponse implements ICloudResponse {
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
