import { ITaxonomySystemAttributes } from './itaxonomy-system-attributes.interface';
import { ITaxonomyTerms } from './itaxonomy-terms.interface';

export interface ITaxonomyGroup {
    system: ITaxonomySystemAttributes;
    terms: ITaxonomyTerms[];
}