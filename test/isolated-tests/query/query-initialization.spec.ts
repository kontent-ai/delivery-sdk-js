// url parser
import urlParser from 'url-parse';

// setup
import { setup, Context } from '../../setup';

// tests
describe('Query initialization', () => {

  const context = new Context();
  setup(context);

  it(`Element query initialization with invalid type should throw Error`, () => {
    expect(() => context.deliveryClient.element(null, 'title')).toThrowError();
  });

  it(`Element query initialization with invalid type should throw Error`, () => {
    expect(() => context.deliveryClient.element('movie', null)).toThrowError();
  });

  it(`Item query initialization with invalid codename should throw Error`, () => {
    expect(() => context.deliveryClient.item(null)).toThrowError();
  });

  it(`Type query initialization with invalid codename should throw Error`, () => {
    expect(() => context.deliveryClient.type(null)).toThrowError();
  });

  it(`Taxonomy query initialization with invalid codename should throw Error`, () => {
    expect(() => context.deliveryClient.taxonomy(null)).toThrowError();
  });

});

