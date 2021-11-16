import { Context, setup } from '../../setup';

describe('Query initialization', () => {

  const context = new Context();
  setup(context);

  it(`Element query initialization with invalid type should throw Error`, () => {
    expect(() => context.deliveryClient.element(null as any, 'title')).toThrowError();
  });

  it(`Element query initialization with invalid type should throw Error`, () => {
    expect(() => context.deliveryClient.element('movie', null as any)).toThrowError();
  });

  it(`Item query initialization with invalid codename should throw Error`, () => {
    expect(() => context.deliveryClient.item(null as any)).toThrowError();
  });

  it(`Type query initialization with invalid codename should throw Error`, () => {
    expect(() => context.deliveryClient.type(null as any)).toThrowError();
  });

  it(`Taxonomy query initialization with invalid codename should throw Error`, () => {
    expect(() => context.deliveryClient.taxonomy(null as any)).toThrowError();
  });

});

