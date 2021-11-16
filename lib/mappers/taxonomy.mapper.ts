import { Contracts } from '../contracts';
import { ITaxonomyGroup, ITaxonomySystemAttributes, ITaxonomyTerms } from '../models';

export class TaxonomyMapper {
    mapTaxonomy(
        taxonomySystem: Contracts.ITaxonomySystemAttributesContract,
        taxonomyTerms: Contracts.ITaxonomyTermsContract[]
    ): ITaxonomyGroup {
        if (!taxonomySystem) {
            throw Error(`Cannot map taxonomy due to missing 'system' property`);
        }

        if (!taxonomyTerms) {
            throw Error(`Cannot map taxonomy due to missing 'terms' property`);
        }

        if (!Array.isArray(taxonomyTerms)) {
            throw Error(`Cannot map terms because no terms array was provided`);
        }

        const mappedSystemAttributes: ITaxonomySystemAttributes = {
            name: taxonomySystem.name,
            codename: taxonomySystem.codename,
            id: taxonomySystem.id,
            lastModified: taxonomySystem.last_modified
        };

        const mappedTerms: ITaxonomyTerms[] = this.mapTaxonomyTerms(taxonomyTerms);

        return {
            system: mappedSystemAttributes,
            terms: mappedTerms
        };
    }

    mapTaxonomies(taxonomies: Contracts.ITaxonomyGroupContract[]): ITaxonomyGroup[] {
        if (!taxonomies) {
            throw Error(`Cannot map taxonomy due to missing 'taxonomies' property`);
        }

        if (!Array.isArray(taxonomies)) {
            throw Error(`Cannot map taxonomies because the 'taxonomies' property is not an array `);
        }

        const mappedTaxonomies: ITaxonomyGroup[] = [];

        taxonomies.forEach((taxonomy) => {
            mappedTaxonomies.push(this.mapTaxonomy(taxonomy.system, taxonomy.terms));
        });

        return mappedTaxonomies;
    }

    /**
     * Recursively map array of taxonomy terms
     * @param termsArray Terms array to map
     */
    private mapTaxonomyTerms(termsArray: Contracts.ITaxonomyTermsContract[]): ITaxonomyTerms[] {
        if (termsArray.length === 0) {
            return [];
        }

        const mappedTermsArray: ITaxonomyTerms[] = [];

        termsArray.forEach((terms) => {
            const mappedTerms: ITaxonomyTerms = {
                codename: terms.codename,
                name: terms.name,
                terms: this.mapTaxonomyTerms(terms.terms)
            };

            mappedTermsArray.push(mappedTerms);
        });

        return mappedTermsArray;
    }
}
