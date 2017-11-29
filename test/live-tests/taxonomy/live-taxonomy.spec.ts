// setup
import { setup, Context } from '../../setup';

// models
import { FieldModels, TaxonomyResponses } from '../../../lib';

// tests
describe('Live taxonomy', () => {

  const context = new Context();
  setup(context);

  const taxonomyCodename: string = 'movietype';
  const termsWithNestedTermsCodename: string = 'film'; // codename of the taxonomy term that has nested terms
  const numberOfNestedTerms: number = 3; // this is the number of nested terms defined by 'termsWithNestedTermsCodename'

  let response: TaxonomyResponses.TaxonomyResponse;

  beforeAll((done) => {
    context.deliveryClient.taxonomy(taxonomyCodename)
      .get()
      .subscribe(r => {
        response = r as TaxonomyResponses.TaxonomyResponse
        done();
      });
  });

  it(`taxomy should be defined`, () => {
    expect(response.taxonomy).toBeDefined();
  });

  it(`taxomy system attributes should be defined`, () => {
    expect(response.taxonomy.system).toBeDefined();
    expect(response.taxonomy.system.codename).toBeDefined();
    expect(response.taxonomy.system.id).toBeDefined();
    expect(response.taxonomy.system.lastModified).toBeDefined();
    expect(response.taxonomy.system.name).toBeDefined();
  });


  it(`taxonomy group should match requested type`, () => {
    expect(response.taxonomy.system.codename).toEqual(taxonomyCodename);
  });

  it(`taxonomy group should have defined terms`, () => {
    expect(response.taxonomy.terms).toBeDefined();
  });

  it(`taxonomy group should have > 0 terms`, () => {
    expect(response.taxonomy.terms.length).toBeGreaterThan(0);
  });

  it(`taxonomy group should contain nested taxonomies`, () => {
    const termsWithNestedTerms = response.taxonomy.terms.find(m => m.codename === termsWithNestedTermsCodename);
    expect(termsWithNestedTerms).toBeDefined();
    expect(termsWithNestedTerms.terms).toBeDefined();
    expect(termsWithNestedTerms.terms.length).toEqual(numberOfNestedTerms);
  });
});

