import { ITaxonomySystemAttributes } from './itaxonomy-system-attributes.interface';
import { ITaxonomyTerms } from './itaxonomy-terms.interface';
import { ITaxonomyGroup } from './itaxonomy-group.interface';

export namespace CloudTaxonomyResponseInterfaces {

    export interface ICloudTaxonomyResponse {
        system: ITaxonomySystemAttributes;
        terms: ITaxonomyTerms[];
    }

    export interface ICloudTaxonomiesResponse {
        taxonomies: ITaxonomyGroup[];
    }
}
