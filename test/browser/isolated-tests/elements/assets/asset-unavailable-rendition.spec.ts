import { Elements, IContentItem } from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../../setup';
import * as responseJson from './asset-unavailable-rendition.spec.json';

describe('Asset unavailable rendition', () => {
    let item: IContentItem;

    beforeAll(async () => {
        const response = await getDeliveryClientWithJson(responseJson).item('xx').toPromise();

        item = response.data.item;
    });

    it(`Renditions 1 should be accessible`, () => {
        const asset = item.elements.property1 as Elements.AssetsElement;
        const image = asset.value[0];
        const rendition = image.renditions;

        expect(rendition).toBeNull();
    });
});
