import { TaxonomyContracts } from '../data-contracts';
import { TaxonomyGroup, TaxonomySystemAttributes, TaxonomyTerms } from '../models';

export class TaxonomyMapper {

    mapTaxonomy(taxonomySystem: TaxonomyContracts.ITaxonomySystemAttributesContract, taxonomyTerms: TaxonomyContracts.ITaxonomyTermsContract[]): TaxonomyGroup {
        if (!taxonomySystem) {
            throw Error(`Cannot map taxonomy due to missing 'system' property`);
        }

        if (!taxonomyTerms) {
            throw Error(`Cannot map taxonomy due to missing 'terms' property`);
        }

        if (!Array.isArray(taxonomyTerms)) {
            throw Error(`Cannot map terms because no terms array was provided`);
        }

        const mappedSystemAttributes: TaxonomySystemAttributes = new TaxonomySystemAttributes({
            name: taxonomySystem.name,
            codename: taxonomySystem.codename,
            id: taxonomySystem.id,
            lastModified: taxonomySystem.last_modified
        });

        const mappedTerms: TaxonomyTerms[] = this.mapTaxonomyTerms(taxonomyTerms);

        return new TaxonomyGroup(mappedSystemAttributes, mappedTerms);
    }

    mapTaxonomies(taxonomies: TaxonomyContracts.ITaxonomyGroupContract[]): TaxonomyGroup[] {
        if (!taxonomies) {
            throw Error(`Cannot map taxonomy due to missing 'taxonomies' property`);
        }

        if (!Array.isArray(taxonomies)) {
            throw Error(`Cannot map taxonomies because the 'taxonomies' property is not an array `);
        }

        const mappedTaxonomies: TaxonomyGroup[] = [];

        taxonomies.forEach(taxonomy => {
            mappedTaxonomies.push(this.mapTaxonomy(taxonomy.system, taxonomy.terms));
        });

        return mappedTaxonomies;
    }

    /**
     * Recursively map array of taxonomy terms
     * @param termsArray Terms array to map
     */
    private mapTaxonomyTerms(termsArray: TaxonomyContracts.ITaxonomyTermsContract[]): TaxonomyTerms[] {
        if (termsArray.length === 0) {
            return [];
        }

        const mappedTermsArray: TaxonomyTerms[] = [];

        termsArray.forEach(terms => {
            const mappedTerms = new TaxonomyTerms({
                codename: terms.codename,
                name: terms.name,
                terms: this.mapTaxonomyTerms(terms.terms)
            });

            mappedTermsArray.push(mappedTerms);
        });

        return mappedTermsArray;
    }
}
