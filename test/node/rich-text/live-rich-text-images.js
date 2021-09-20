const assert = require('assert');
const KontentDelivery = require('../../../dist/cjs');

const movieCodename = 'warrior';

const deliveryClient = new KontentDelivery.DeliveryClient({
  projectId: 'da5abe9f-fdad-4168-97cd-b3464be2ccb9',
  typeResolvers: [],
});

describe('#Rich text element with images', () => {

  let plot;
  let item;

  before(async () => {
    const response = (await deliveryClient.item(movieCodename)
      .queryConfig({
        richTextImageResolver: (image, elementName) => {
          var newUrl = new KontentDelivery.ImageUrlBuilder(image.url)
            .withCustomParam('x=y')
            .getUrl();

          return {
            url: newUrl
          };
        }
      })
      .toPromise()
    ).data;
    item = response.item;
    plot = response.item.elements.plot.resolveHtml();
  });

  it('Rich text should contain expected image markup', () => {
    item.elements.plot.images.forEach(image => {
      const newImageUrl = image.url + '?x=y';
      const imageHtml = getImageSrcHtml(newImageUrl);
      assert.ok(plot.includes(imageHtml));
    });
  });

  function getImageSrcHtml(imageUrl) {
    return `src=\"${imageUrl}"`;
  }

});
