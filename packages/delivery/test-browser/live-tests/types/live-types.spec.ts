import { TypeResponses } from '../../../lib';
import { Context, setup } from '../../setup';

describe('Live types', () => {

  const context = new Context();
  setup(context);

  let response: TypeResponses.ListContentTypesResponse;

  beforeAll((done) => {
    context.deliveryClient.types()
      .toObservable()
      .subscribe(r => {
        response = r as TypeResponses.ListContentTypesResponse;
        done();
      });
  });

  it(`types should be defined`, () => {
    expect(response).toBeDefined();
  });

  it(`types should have pagination`, () => {
    expect(response.pagination).toBeDefined();
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

