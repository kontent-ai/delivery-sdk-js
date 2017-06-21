// setup
import { setup, Context, Actor, Movie } from '../../setup';

// models
import { DeliveryItemResponse, MultipleChoiceOption } from '../../../../lib';

// tests
describe('Live item', () => {

  var context = new Context();
  setup(context);

  var movieCodename: string = 'warrior';
  var response: DeliveryItemResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.item<Movie>(movieCodename)
      .get()
      .subscribe(r => {
        response = r as DeliveryItemResponse<Movie>;
        done();
      });
  });

  it(`item response should be defined`, () => {
    expect(response).toBeDefined();
  });

  it(`item should be defined`, () => {
    expect(response.item).toBeDefined();
  });

  it(`item should be instance of 'Movie' class`, () => {
    expect(response.item).toEqual(jasmine.any(Movie));
  });

  it(`item should be instance of 'Movie' class`, () => {
    expect(response.item).toEqual(jasmine.any(Movie));
  });

  it(`title should be 'Warrior'`, () => {
    expect(response.item.title.text).toEqual('Warrior');
  });

  it(`verify 'plot' rich text field with modular content contains expected html`, () => {
    var html = response.item.plot.getHtml();
    expect(html).toContain('<p>Tom</p>');
  });

  it(`released date should be '2011-09-09T00:00:00Z'`, () => {
    expect(response.item.released.datetime).toEqual(new Date('2011-09-09T00:00:00Z'));
  });

  it(`poster asset should be defined`, () => {
    expect(response.item.poster).toBeDefined();
  });

  it(`poster asset' url should be set`, () => {
    expect(response.item.poster.assets[0].url).toEqual('https://assets.kenticocloud.com:443/da5abe9f-fdad-4168-97cd-b3464be2ccb9/22504ba8-2075-48fa-9d4f-8fce3de1754a/warrior.jpg');
  });

  it(`category options should be defined`, () => {
    expect(response.item.category.options).toBeDefined();
  });

  it(`there should be 2 category options defined`, () => {
    expect(response.item.category.options.length).toEqual(2);
  });

  it(`checks codename of first category option`, () => {
    expect(response.item.category.options[0].codename).toEqual('action');
  });

  it(`checks codename of second category option`, () => {
    expect(response.item.category.options[1].codename).toEqual('drama');
  });

  it(`checks that category options are of proper type`, () => {
    expect(response.item.category.options[1]).toEqual(jasmine.any(MultipleChoiceOption));
  });

  it(`stars modular items should be defined`, () => {
    expect(response.item.stars).toBeDefined();
  });

  it(`check number of stars items`, () => {
    expect(response.item.stars.length).toEqual(2);
  });

  it(`check that type of stars property is correct`, () => {
    expect(response.item.stars[0]).toEqual(jasmine.any(Actor));
  });

  it(`Check that modular item (Actor) has 'firstName' text properly assigned`, () => {
    expect(response.item.stars[0].firstName.text).toEqual('Tom');
  });

  it(`url slug field should be defined`, () => {
    expect(response.item.seoname).toBeDefined();
  });

  it(`url of url slug field should be resolved`, () => {
    expect(response.item.seoname.url).toEqual('testSlugUrl/warrior');
  });
});

