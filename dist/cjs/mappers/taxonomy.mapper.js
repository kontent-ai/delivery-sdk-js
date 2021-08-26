"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxonomyMapper = void 0;
const models_1 = require("../models");
class TaxonomyMapper {
    mapTaxonomy(taxonomySystem, taxonomyTerms) {
        if (!taxonomySystem) {
            throw Error(`Cannot map taxonomy due to missing 'system' property`);
        }
        if (!taxonomyTerms) {
            throw Error(`Cannot map taxonomy due to missing 'terms' property`);
        }
        if (!Array.isArray(taxonomyTerms)) {
            throw Error(`Cannot map terms because no terms array was provided`);
        }
        const mappedSystemAttributes = new models_1.TaxonomySystemAttributes({
            name: taxonomySystem.name,
            codename: taxonomySystem.codename,
            id: taxonomySystem.id,
            lastModified: taxonomySystem.last_modified
        });
        const mappedTerms = this.mapTaxonomyTerms(taxonomyTerms);
        return new models_1.TaxonomyGroup(mappedSystemAttributes, mappedTerms);
    }
    mapTaxonomies(taxonomies) {
        if (!taxonomies) {
            throw Error(`Cannot map taxonomy due to missing 'taxonomies' property`);
        }
        if (!Array.isArray(taxonomies)) {
            throw Error(`Cannot map taxonomies because the 'taxonomies' property is not an array `);
        }
        const mappedTaxonomies = [];
        taxonomies.forEach(taxonomy => {
            mappedTaxonomies.push(this.mapTaxonomy(taxonomy.system, taxonomy.terms));
        });
        return mappedTaxonomies;
    }
    /**
     * Recursively map array of taxonomy terms
     * @param termsArray Terms array to map
     */
    mapTaxonomyTerms(termsArray) {
        if (termsArray.length === 0) {
            return [];
        }
        const mappedTermsArray = [];
        termsArray.forEach(terms => {
            const mappedTerms = new models_1.TaxonomyTerms({
                codename: terms.codename,
                name: terms.name,
                terms: this.mapTaxonomyTerms(terms.terms)
            });
            mappedTermsArray.push(mappedTerms);
        });
        return mappedTermsArray;
    }
}
exports.TaxonomyMapper = TaxonomyMapper;
//# sourceMappingURL=taxonomy.mapper.js.map