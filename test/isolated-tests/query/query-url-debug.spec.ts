// url parser
import urlParser from 'url-parse';

// setup
import { setup, Context } from '../../setup';

// tests
describe('Query url debug', () => {

  var context = new Context();
  setup(context);

  it(`Item url`, () => {
    var url = context.deliveryClient.item<any>('warrior').toString();
    expect(url).toContain('items/warrior');
  });

  it(`Items url`, () => {
    var url = context.deliveryClient.items<any>().toString();
    expect(url).toContain('items');
  });

  it(`Taxonomy url`, () => {
    var url = context.deliveryClient.taxonomy('taxonomy_field').toString();
    expect(url).toContain('taxonomies/taxonomy_field');
  });

  it(`Taxonomies url`, () => {
    var url = context.deliveryClient.taxonomies().toString();
    expect(url).toContain('taxonomies');
  });

  it(`Type url`, () => {
    var url = context.deliveryClient.type('movie').toString();
    expect(url).toContain('types/movie');
  });

  it(`Types url`, () => {
    var url = context.deliveryClient.types().toString();
    expect(url).toContain('types');
  });

  it(`Element url`, () => {
    var url = context.deliveryClient.element('movie', 'title').toString();
    expect(url).toContain('types/movie/elements/title');
  });

});

