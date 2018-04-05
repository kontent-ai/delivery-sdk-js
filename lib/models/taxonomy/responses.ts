import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';
import { ICloudResponse } from '../../interfaces/common/icloud-response.interface';
import { IPagination } from '../../interfaces/common/ipagination.interface';
import { TaxonomyGroup } from './taxonomy-group.class';

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
            public pagination: IPagination,

            /**
             * Debug information
             */
            public debug: ICloudResponseDebug
        ) {
        }
    }
}
