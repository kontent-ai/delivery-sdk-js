import { Elements, IContentItem } from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../../setup';
import * as responseJson from './asset-rendition.spec.json';

describe('Asset rendition', () => {
    let item: IContentItem;

    beforeAll(async () => {
        const response = (await getDeliveryClientWithJson(responseJson).item('xx').toPromise());

        item = response.data.item;
    });

    it(`Renditions 1 should be accessible`, () => {
        const asset = item.elements.property1 as Elements.AssetsElement;
        const image = asset.value[0];
        const rendition = image.renditions?.default;

        const rawRendition = responseJson.item.elements.property1.value[0].renditions.default;
        expect(rendition?.rendition_id).toEqual(rawRendition.rendition_id);
        expect(rendition?.height).toEqual(rawRendition.height);
        expect(rendition?.preset_id).toEqual(rawRendition.preset_id);
        expect(rendition?.query).toEqual(rawRendition.query);
        expect(rendition?.width).toEqual(rawRendition.width);
    });

    it(`Renditions 2 should be accessible`, () => {
        const asset = item.elements.property2 as Elements.AssetsElement;
        const image = asset.value[0];
        const rendition = image.renditions?.default;

        const rawRendition = responseJson.item.elements.property2.value[0].renditions.default;
        expect(rendition?.rendition_id).toEqual(rawRendition.rendition_id);
        expect(rendition?.height).toEqual(rawRendition.height);
        expect(rendition?.preset_id).toEqual(rawRendition.preset_id);
        expect(rendition?.query).toEqual(rawRendition.query);
        expect(rendition?.width).toEqual(rawRendition.width);
    });
});
