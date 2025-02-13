import { deliveryUrlHelper } from '../../../../../lib';
import { getDeliveryClientWithJson, Movie } from '../../../setup';
import * as responseJson from '../../fake-data/fake-warrior-response.json';

describe('Custom assets domain', () => {
    let item: Movie;
    const customDomain: string = 'https://custom.com';

    beforeAll(async () => {
        const response = await getDeliveryClientWithJson(responseJson, {
            assetsDomain: customDomain,
            environmentId: 'x'
        })
            .item<Movie>('xx')
            .toPromise();

        item = response.data.item;
    });

    it(`Custom asset domain should be set in asset element`, () => {
        const assetElement = item.elements.poster.value[0];

        expect(assetElement.url).toEqual(
            `${customDomain}/da5abe9f-fdad-4168-97cd-b3464be2ccb9/22504ba8-2075-48fa-9d4f-8fce3de1754a/warrior.jpg`
        );
    });

    it(`Custom asset domain should be set for rendition URL in asset element`, () => {
        const assetElement = item.elements.poster.value[0];

        expect(assetElement.renditions?.['default'].url).toEqual(
            `${customDomain}/da5abe9f-fdad-4168-97cd-b3464be2ccb9/22504ba8-2075-48fa-9d4f-8fce3de1754a/warrior.jpg?w=1280&h=1024&fit=clip&rect=2396,169,1280,1024`
        );
    });

    it(`Custom asset domain should be set in Rich Text element`, () => {
        const richTextElement = item.elements.plot;

        for (const image of richTextElement.images) {
            const imagePathname = deliveryUrlHelper.getPathname(image.url);
            expect(image.url).toEqual(`${customDomain}${imagePathname}`);
        }
    });

    it(`Custom asset domain should be set in HTML of Rich Text elements`, () => {
        const richTextElement = item.elements.plot;

        for (const image of richTextElement.images) {
            expect(richTextElement.value).toContain(image.url);
        }
    });
});
