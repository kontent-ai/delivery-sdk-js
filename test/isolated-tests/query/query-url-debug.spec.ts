import { Context, setup } from '../../setup';

describe('Query url debug', () => {

  const context = new Context();
  setup(context);

  it(`Item url`, () => {
    const url = context.deliveryClient.item<any>('warrior').toString();
    expect(url).toContain('items/warrior');
  });

  it(`Items url`, () => {
    const url = context.deliveryClient.items<any>().toString();
    expect(url).toContain('items');
  });

  it(`Taxonomy url`, () => {
    const url = context.deliveryClient.taxonomy('taxonomy_field').toString();
    expect(url).toContain('taxonomies/taxonomy_field');
  });

  it(`Taxonomies url`, () => {
    const url = context.deliveryClient.taxonomies().toString();
    expect(url).toContain('taxonomies');
  });

  it(`Type url`, () => {
    const url = context.deliveryClient.type('movie').toString();
    expect(url).toContain('types/movie');
  });

  it(`Types url`, () => {
    const url = context.deliveryClient.types().toString();
    expect(url).toContain('types');
  });

  it(`Element url`, () => {
    const url = context.deliveryClient.element('movie', 'title').toString();
    expect(url).toContain('types/movie/elements/title');
  });

});

