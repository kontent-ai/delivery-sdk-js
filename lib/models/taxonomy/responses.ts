import { TaxonomySystemAttributes } from './taxonomy-system-attributes.class';
import { TaxonomyTerms } from './taxonomy-terms.class';
import { TaxonomyGroup } from './taxonomy-group.class';
import { ICloudResponse } from '../../interfaces/common/icloud-response.interface';
import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';

export namespace TaxonomyResponses {

    export class TaxonomyResponse implements ICloudResponse {
        constructor(
            public system: TaxonomySystemAttributes,
            public terms: TaxonomyTerms[],
            public debug: ICloudResponseDebug 
        ) {
        }
    }

    export class TaxonomiesResponse implements ICloudResponse  {
        constructor(
            public taxonomies: TaxonomyGroup[],
            public debug: ICloudResponseDebug 
        ) {
        }
    }
}