import { ItemResponses } from '../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Localized item', () => {

  const context = new Context();
  setup(context);

  const language: string = 'cz';
  const movieCodename: string = 'warrior';
  let response: ItemResponses.DeliveryItemResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.item<Movie>(movieCodename)
      .languageParameter(language)
      .toObservable()
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

