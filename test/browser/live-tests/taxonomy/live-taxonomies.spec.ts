import { TaxonomyGroup, TaxonomyResponses, TaxonomyTerms } from '../../../../lib';
import { Context, setup } from '../../setup';

describe('Live taxonomies', () => {
    const context = new Context();
    setup(context);

    const termsWithNestedTermsCodename: string = 'film'; // codename of the taxonomy term that has nested terms
    const numberOfNestedTerms: number = 3; // this is the number of nested terms defined by 'termsWithNestedTermsCodename'
    const existingTaxonomyCodename: string = 'movietype'; // codename of some of the defined taxonomies
    const numberOfTaxonomies: number = 2; // number of defined taxonomies

    let response: TaxonomyResponses.IListTaxonomiesResponse;
    let taxonomy: TaxonomyGroup;

    beforeAll(async () => {
        response = (await context.deliveryClient.taxonomies().toPromise()).data;

        taxonomy = response.items.find((m) => m.system.codename === existingTaxonomyCodename) as TaxonomyGroup;
    });

    it(`taxonomies should have pagination`, () => {
        expect(response.pagination).toBeDefined();
    });

    it(`taxonomies should be defined`, () => {
        expect(response.items).toBeDefined();
    });

    it(`there should be '${numberOfTaxonomies}' taxonomies`, () => {
        expect(response.items.length).toEqual(numberOfTaxonomies);
    });

    it(`taxonomy with codename '${existingTaxonomyCodename}' should be defined`, () => {
        expect(taxonomy).toBeDefined();
    });

    it(`taxomy system attributes should be defined`, () => {
        if (!taxonomy) {
            throw Error('undefined');
        }
        expect(taxonomy.system).toBeDefined();
        expect(taxonomy.system.codename).toBeDefined();
        expect(taxonomy.system.id).toBeDefined();
        expect(taxonomy.system.lastModified).toBeDefined();
        expect(taxonomy.system.name).toBeDefined();
    });

    it(`taxonomy group should match requested type`, () => {
        if (!taxonomy) {
            throw Error('undefined');
        }
        expect(taxonomy.system.codename).toEqual(existingTaxonomyCodename);
    });

    it(`taxonomy group should have defined terms`, () => {
        if (!taxonomy) {
            throw Error('undefined');
        }
        expect(taxonomy.terms).toBeDefined();
    });

    it(`taxonomy group should have > 0 terms`, () => {
        if (!taxonomy) {
            throw Error('undefined');
        }
        expect(taxonomy.terms.length).toBeGreaterThan(0);
    });

    it(`taxonomy group should contain nested taxonomies`, () => {
        const termsWithNestedTerms = taxonomy.terms.find(
            (m) => m.codename === termsWithNestedTermsCodename
        ) as TaxonomyTerms;
        expect(termsWithNestedTerms).toBeDefined();

        expect(termsWithNestedTerms.terms).toBeDefined();
        expect(termsWithNestedTerms.terms.length).toEqual(numberOfNestedTerms);
    });
});
