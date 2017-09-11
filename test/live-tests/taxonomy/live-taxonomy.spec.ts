// setup
import { setup, Context } from '../../setup';

// models
import { FieldModels, TaxonomyResponses } from '../../../lib';

// tests
describe('Live taxonomy', () => {

  var context = new Context();
  setup(context);

  var taxonomyCodename: string = 'movietype';
  var termsWithNestedTermsCodename: string = 'film'; // codename of the taxonomy term that has nested terms
  var numberOfNestedTerms: number = 3; // this is the number of nested terms defined by 'termsWithNestedTermsCodename'
  var response: TaxonomyResponses.TaxonomyResponse;

  beforeAll((done) => {
    context.deliveryClient.taxonomy(taxonomyCodename)
      .get()
      .subscribe(r => {
        response = r as TaxonomyResponses.TaxonomyResponse
        done();
      });
  });

  it(`taxomy should be defined`, () => {
    expect(response).toBeDefined();
  });

  it(`taxomy system attributes should be defined`, () => {
    expect(response.system).toBeDefined();
    expect(response.system.codename).toBeDefined();
    expect(response.system.id).toBeDefined();
    expect(response.system.lastModified).toBeDefined();
    expect(response.system.name).toBeDefined();
  });

  it(`taxonomy group should match requested type`, () => {
    expect(response.system.codename).toEqual(taxonomyCodename);
  });

  it(`taxonomy group should have defined terms`, () => {
    expect(response.terms).toBeDefined();
  });

  it(`taxonomy group should have > 0 terms`, () => {
    expect(response.terms.length).toBeGreaterThan(0);
  });

  it(`taxonomy group should contain nested taxonomies`, () => {
    var termsWithNestedTerms = response.terms.find(m => m.codename === termsWithNestedTermsCodename);
    expect(termsWithNestedTerms).toBeDefined();
    expect(termsWithNestedTerms.terms).toBeDefined();
    expect(termsWithNestedTerms.terms.length).toEqual(numberOfNestedTerms);
  });
});

