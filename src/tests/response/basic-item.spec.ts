// setup
import { setup, Context, Actor, Movie } from '../setup';

// models
import { DeliveryItemResponse } from '../../../lib';

// tests
describe('Basic content item', () => {

  var context = new Context();
  setup(context);

  var movieCodename: string = 'warrior';
  var movieResponse: DeliveryItemResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.item<Movie>(movieCodename)
      .get()
      .subscribe(response => {
        movieResponse = response as DeliveryItemResponse<Movie>;
        done();
      });
  });

  it(`item response should be defined`, () => {
    expect(movieResponse).toBeDefined();
  });

  it(`item should be defined`, () => {
    expect(movieResponse.item).toBeDefined();
  });

  it(`item should be instance of 'Movie' class`, () => {
    expect(movieResponse.item).toEqual(jasmine.any(Movie));
  });
});

