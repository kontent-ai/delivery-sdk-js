// setup
import { setup, Context, Actor, Movie } from '../../setup';

// models
import { ItemResponses, FieldModels, TypeResponses } from '../../../lib';

// tests
describe('Live types', () => {

  var context = new Context();
  setup(context);

  var response: TypeResponses.DeliveryTypeListingResponse;

  beforeAll((done) => {
    context.deliveryClient.types()
      .get()
      .subscribe(r => {
        response = r as TypeResponses.DeliveryTypeListingResponse;
        done();
      });
  });

  it(`types should be defined`, () => {
    expect(response).toBeDefined();
  });

  it(`there should be at least 1 type`, () => {
    expect(response.types.length).toBeGreaterThan(0);
  });

  it(`elements should be defined`, () => {
    expect(response.types[0].elements).toBeDefined();
  });

  it(`system properties should be defined`, () => {
    expect(response.types[0].system).toBeDefined();
  });

  it(`pagination should be defined`, () => {
    expect(response.pagination).toBeDefined();
  });
});

