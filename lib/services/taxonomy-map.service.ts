import { DeliveryClientConfig } from '../config/delivery-client.config';
import { ITaxonomySystemAttributes } from '../interfaces/taxonomy/itaxonomy-system-attributes.interface';
import { ITaxonomyTerms } from '../interfaces/taxonomy/itaxonomy-terms.interface';
import { TaxonomySystemAttributes } from '../models/taxonomy/taxonomy-system-attributes.class';
import { TaxonomyTerms } from '../models/taxonomy/taxonomy-terms.class';
import { TaxonomyGroup } from '../models/taxonomy/taxonomy-group.class';
import { ITaxonomyGroup } from '../interfaces/taxonomy/itaxonomy-group.interface';

export class TaxonomyMapService {

    constructor(
    ) {
    }

    mapTaxonomy(taxonomySystem: ITaxonomySystemAttributes, taxonomyTerms: ITaxonomyTerms[]): TaxonomyGroup {
        if (!taxonomySystem) {
            throw Error(`Cannot map taxonomy due to missing 'system' property`);
        }

        if (!taxonomyTerms) {
            throw Error(`Cannot map taxonomy due to missing 'terms' property`);
        }

        var mappedSystemAttributes: TaxonomySystemAttributes = new TaxonomySystemAttributes(
            taxonomySystem.id,
            taxonomySystem.name,
            taxonomySystem.codename,
            taxonomySystem.last_modified
        );

        var mappedTerms: TaxonomyTerms[] = this.mapTaxonomyTerms(taxonomyTerms);

        return new TaxonomyGroup(mappedSystemAttributes, mappedTerms);
    }

    mapTaxonomies(taxonomies: ITaxonomyGroup[]): TaxonomyGroup[] {
        if (!taxonomies) {
            throw Error(`Cannot map taxonomy due to missing 'taxonomies' property`);
        }

        if (!Array.isArray(taxonomies)) {
            throw Error(`Cannot map taxonomies because the 'taxonomies' property is not an array `);
        }

        var mappedTaxonomies: TaxonomyGroup[] = [];

        taxonomies.forEach(taxonomy => {
            mappedTaxonomies.push(this.mapTaxonomy(taxonomy.system, taxonomy.terms));
        })

        return mappedTaxonomies;
    }

    /**
     * Recursively map array of taxonomy terms
     * @param termsArray Terms array to map
     */
    private mapTaxonomyTerms(termsArray: ITaxonomyTerms[]): TaxonomyTerms[] {
        if (!termsArray) {
            throw Error(`Cannot map taxonomy terms due to invalid property data`);
        }

        if (!Array.isArray(termsArray)) {
            throw Error(`Cannot map terms because no terms array was provided`);
        }

        if (termsArray.length == 0) {
            return [];
        }

        var mappedTermsArray: TaxonomyTerms[] = [];

        termsArray.forEach(terms => {
            var mappedTerms = new TaxonomyTerms(
                terms.name,
                terms.codename,
                this.mapTaxonomyTerms(terms.terms)
            );

            mappedTermsArray.push(mappedTerms);
        });

        return mappedTermsArray;
    }
}