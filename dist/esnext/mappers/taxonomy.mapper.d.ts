import { TaxonomyContracts } from '../data-contracts';
import { TaxonomyGroup } from '../models';
export declare class TaxonomyMapper {
    mapTaxonomy(taxonomySystem: TaxonomyContracts.ITaxonomySystemAttributesContract, taxonomyTerms: TaxonomyContracts.ITaxonomyTermsContract[]): TaxonomyGroup;
    mapTaxonomies(taxonomies: TaxonomyContracts.ITaxonomyGroupContract[]): TaxonomyGroup[];
    /**
     * Recursively map array of taxonomy terms
     * @param termsArray Terms array to map
     */
    private mapTaxonomyTerms;
}
