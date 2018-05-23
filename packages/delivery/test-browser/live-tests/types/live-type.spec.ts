import { TypeResponses, Element } from '../../../lib';
import { Context, setup } from '../../setup';

describe('Live type', () => {

  const context = new Context();
  setup(context);

  const codename: string = 'movie';
  let response: TypeResponses.DeliveryTypeResponse;

  const multipleChoiceElement: string = 'category';
  const taxonomyElement: string = 'releasecategory';

  beforeAll((done) => {
    context.deliveryClient.type(codename)
      .getObservable()
      .subscribe(r => {
        response = r as TypeResponses.DeliveryTypeResponse;
        done();
      });
  });

  it(`type should be defined`, () => {
    expect(response).toBeDefined();
  });

  it(`elements should be defined`, () => {
    expect(response.type.elements).toBeDefined();
  });

  it(`system properties should be defined`, () => {
    expect(response.type.system).toBeDefined();
  });

  it(`proper type should be returned based on test config`, () => {
    expect(response.type.system.codename).toEqual(codename);
  });

  it(`Verifies taxonomy element - '${taxonomyElement}'`, () => {
    const releaseCategoryElement = response.type.elements.find(m => m.codename === taxonomyElement) as Element;
    expect(releaseCategoryElement).toBeDefined();
    expect(releaseCategoryElement.taxonomyGroup).toBeDefined();
    expect(releaseCategoryElement.taxonomyGroup).toEqual('releasecategory');
  });

  it(`Verifies multiple_choice element - '${multipleChoiceElement}'`, () => {
    const categoryElement = response.type.elements.find(m => m.codename === multipleChoiceElement) as Element;

    expect(categoryElement).toBeDefined();
    expect(categoryElement.options).toBeDefined();
    expect(categoryElement.options.length).toBeGreaterThan(0);
    expect(categoryElement.options[0].codename).toBeDefined();
    expect(categoryElement.options[0].name).toBeDefined();
  });

});

