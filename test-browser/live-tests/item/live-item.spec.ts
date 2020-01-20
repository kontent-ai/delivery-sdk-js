import { ElementModels, ImageUrlBuilder, ItemResponses, RichTextImage } from '../../../lib';
import { Actor, Context, Movie, setup } from '../../setup';

describe('Live item', () => {

  const context = new Context();
  setup(context);

  const movieCodename: string = 'warrior';
  let response: ItemResponses.ViewContentItemResponse<Movie>;

  beforeAll((done) => {
    context.deliveryClient.item<Movie>(movieCodename)
      .queryConfig({
        richTextImageResolver: (image, elementName) => {
          const newImageUrl = new ImageUrlBuilder(image.url)
            .withCustomParam('xParam', 'xValue')
            .getUrl();

          return {
            url: newImageUrl
          };
        },
      })
      .toObservable()
      .subscribe(r => {
        response = r;
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
    expect(response.item.title.value).toEqual('Warrior');
  });

  it(`verify 'plot' rich text element with linked items contains expected html`, () => {
    const html = response.item.plot.resolveHtml();
    expect(html).toContain('<p>Tom</p>');
  });

  it(`released date should be '2011-09-09T00:00:00Z'`, () => {
    expect(response.item.released.value).toEqual(new Date('2011-09-09T00:00:00Z'));
  });

  it(`poster asset should be defined`, () => {
    expect(response.item.poster).toBeDefined();
  });

  it(`poster asset' url should be set`, () => {
    const assetUrl = response.item.poster.value[0].url;
    expect(assetUrl).toBeDefined();
    expect(assetUrl).toContain('https://');
  });

  it(`category options should be defined`, () => {
    expect(response.item.category.value).toBeDefined();
  });

  it(`there should be 2 category options defined`, () => {
    expect(response.item.category.value.length).toEqual(2);
  });

  it(`checks codename of first category option`, () => {
    expect(response.item.category.value[0].codename).toEqual('action');
  });

  it(`checks codename of second category option`, () => {
    expect(response.item.category.value[1].codename).toEqual('drama');
  });

  it(`checks that category options are of proper type`, () => {
    expect(response.item.category.value[1]).toEqual(jasmine.any(ElementModels.MultipleChoiceOption));
  });

  it(`stars linked items should be defined`, () => {
    expect(response.item.stars).toBeDefined();
  });

  it(`check number of stars items`, () => {
    expect(response.item.stars.value.length).toEqual(2);
  });

  it(`checks that linkedItemCodenames element is mapped and container proper data`, () => {
    expect(response.item.plot.linkedItemCodenames).toBeDefined();
    expect(response.item.plot.linkedItemCodenames).toContain('tom_hardy');
    expect(response.item.plot.linkedItemCodenames).toContain('joel_edgerton');
  });

  it(`check that type of stars property is correct`, () => {
    expect(response.item.stars.value[0]).toEqual(jasmine.any(Actor));
  });

  it(`check that linked item (Actor) has 'firstName' text properly assigned`, () => {
    expect(response.item.stars.value[0].firstName.value).toEqual('Tom');
  });

  it(`url slug element should be defined`, () => {
    expect(response.item.seoname).toBeDefined();
  });

  it(`url of url slug element should be resolved`, () => {
    expect(response.item.seoname.resolveUrl()).toEqual('testSlugUrl/warrior');
  });

  it(`checks that html contains resolved linked item content #1`, () => {
    const expectedHtml = `<p>Tom</p>`;
    expect(response.item.plot.resolveHtml()).toContain(expectedHtml);
  });

  it(`checks that html contains resolved linked item content #2`, () => {
    const expectedHtml = `<p>Joel</p>`;
    expect(response.item.plot.resolveHtml()).toContain(expectedHtml);
  });

  it(`checks that html contains resolved url #1`, () => {
    const expectedHtml = `/actor/tom`;
    expect(response.item.plot.resolveHtml()).toContain(expectedHtml);
  });

  it(`checks that html contains resolved url #2`, () => {
    const expectedHtml = `/actor/joel`;
    expect(response.item.plot.resolveHtml()).toContain(expectedHtml);
  });

  it(`debug property should be defiend and filled with debug data`, () => {
    expect(response.item._raw).toBeDefined();
    expect(response.item._raw.elements).toBeDefined();

    expect(response.item._raw.elements.title.value).toEqual(response.item.title.value);
  });

  it(`images should be mapped in plot rich text element`, () => {
    const images = response.item.plot.images;

    expect(images).toBeDefined();
    expect(images.length).toEqual(2);

    images.forEach(image => {
      expect(image).toEqual(jasmine.any(RichTextImage));

      // get original image
      const newImageUrl = image.url + '?xParam=xValue';
      const plotHtml = response.item.plot.resolveHtml();

      expect(plotHtml).toContain(`src="${newImageUrl}"`);
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
    });
  });

  it(`verify linked items included in response`, () => {
    expect(Object.keys(response.linkedItems).length).toEqual(3);
    console.log(response);
    for (const key of Object.keys(response.linkedItems)) {
      const linkedItem = response.linkedItems[key];
      expect(linkedItem).toEqual(jasmine.any(Actor));

    }
  });

});

