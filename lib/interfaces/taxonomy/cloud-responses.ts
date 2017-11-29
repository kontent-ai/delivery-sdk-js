import { ITaxonomySystemAttributes } from './itaxonomy-system-attributes.interface';
import { ITaxonomyTerms } from './itaxonomy-terms.interface';
import { ITaxonomyGroup } from './itaxonomy-group.interface';
import { IPagination } from '../common/ipagination.interface';

export namespace CloudTaxonomyResponseInterfaces {

    export interface ICloudTaxonomyResponse {
        system: ITaxonomySystemAttributes;
        terms: ITaxonomyTerms[];
    }

    export interface ICloudTaxonomiesResponse {
        taxonomies: ITaxonomyGroup[];
        pagination: IPagination;
    }
}
