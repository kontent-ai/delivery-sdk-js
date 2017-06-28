// setup
import { setup, Context, Actor, Movie } from '../../setup';

// models
import { ItemResponses } from '../../../lib';

// tests
describe('Localized item', () => {

  var context = new Context();
  setup(context);

  var language: string = 'cz';
  var movieCodename: string = 'warrior';
  var response: ItemResponses.DeliveryItemResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.item<Movie>(movieCodename)
      .languageParameter(language)
      .get()
      .subscribe(r => {
        response = r as ItemResponses.DeliveryItemResponse<Movie>;
        done();
      });
  });

  it(`language should be '${language}'`, () => {
    expect(response.item.system.language).toEqual(language);
  });

  it(`title should be localized`, () => {
    expect(response.item.title.text).toEqual('Warrior-cz');
  });
});

