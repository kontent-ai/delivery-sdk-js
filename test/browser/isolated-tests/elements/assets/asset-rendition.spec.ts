import { Elements, IContentItem } from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../../setup';
import * as responseJson from './asset-rendition.spec.json';

describe('Asset renditions', () => {
    let item: IContentItem;

    describe('renditions are correctly set', () => {
        beforeAll(async () => {
            const response = (await getDeliveryClientWithJson(responseJson).item('xx').toPromise());

            item = response.data.item;
        });

        it(`Asset element without rendition - renditions are null`, () => {
            const asset = item.elements.assetWithoutRendition as Elements.AssetsElement;
            const image = asset.value[0];
            const renditions = image.renditions;

            expect(renditions).toBeNull();
        });

        it(`Asset element with rendition in default preset - renditions should be accessible`, () => {
            const asset = item.elements.assetWithRenditionInDefaultPreset as Elements.AssetsElement;
            const image = asset.value[0];
            const rendition = image.renditions?.default;

            const rawImage = responseJson.item.elements.assetWithRenditionInDefaultPreset.value[0];
            const rawRendition = rawImage.renditions.default;
            expect(rendition?.rendition_id).toEqual(rawRendition.rendition_id);
            expect(rendition?.height).toEqual(rawRendition.height);
            expect(rendition?.preset_id).toEqual(rawRendition.preset_id);
            expect(rendition?.query).toEqual(rawRendition.query);
            expect(rendition?.width).toEqual(rawRendition.width);
            expect(rendition?.url).toEqual(`${rawImage.url}?${rawRendition.query}`);
        });

        it(`Asset element with rendition in mobile preset - renditions should be accessible`, () => {
            const asset = item.elements.assetWithRenditionInMobilePreset as Elements.AssetsElement;
            const image = asset.value[0];
            const rendition = image.renditions?.mobile;

            const rawImage = responseJson.item.elements.assetWithRenditionInMobilePreset.value[0];
            const rawRendition = rawImage.renditions.mobile;
            expect(rendition?.height).toEqual(rawRendition.height);
            expect(rendition?.preset_id).toEqual(rawRendition.preset_id);
            expect(rendition?.query).toEqual(rawRendition.query);
            expect(rendition?.width).toEqual(rawRendition.width);
            expect(rendition?.url).toEqual(`${rawImage.url}?${rawRendition.query}`);
        });
    });

    describe('no default profile specified in config', () => {
        beforeAll(async () => {
            const response = (await getDeliveryClientWithJson(responseJson).item('xx').toPromise());

            item = response.data.item;
        });

        it(`Asset element without rendition - renditions are null`, () => {
            const asset = item.elements.assetWithoutRendition as Elements.AssetsElement;
            const image = asset.value[0];
            const renditions = image.renditions;

            const rawImage = responseJson.item.elements.assetWithoutRendition.value[0];
            expect(image.url).toEqual(rawImage.url);
            expect(renditions).toBeNull();
        });

        it(`Asset element with rendition in default preset - URL of original asset`, () => {
            const asset = item.elements.assetWithRenditionInDefaultPreset as Elements.AssetsElement;
            const image = asset.value[0];
            const rendition = image.renditions?.default;

            const rawImage = responseJson.item.elements.assetWithRenditionInDefaultPreset.value[0];
            const rawRendition = rawImage.renditions.default;
            expect(image.url).toEqual(rawImage.url);
            expect(rendition?.url).toEqual(`${rawImage.url}?${rawRendition.query}`);
        });

        it(`Asset element with rendition in mobile preset - URL of original asset`, () => {
            const asset = item.elements.assetWithRenditionInMobilePreset as Elements.AssetsElement;
            const image = asset.value[0];
            const rendition = image.renditions?.mobile;

            const rawImage = responseJson.item.elements.assetWithRenditionInMobilePreset.value[0];
            const rawRendition = rawImage.renditions.mobile;
            expect(image.url).toEqual(rawImage.url);
            expect(rendition?.url).toEqual(`${rawImage.url}?${rawRendition.query}`);
        });
    });

    describe('with default preset specified in config', () => {
        beforeAll(async () => {
            const response = (await getDeliveryClientWithJson(responseJson, {
                defaultRenditionPreset: 'default',
                projectId: 'x'
            }).item('xx').toPromise());

            item = response.data.item;
        });

        it(`Asset element without rendition - URL of original asset`, () => {
            const asset = item.elements.assetWithoutRendition as Elements.AssetsElement;
            const image = asset.value[0];
            const renditions = image.renditions;

            const rawImage = responseJson.item.elements.assetWithoutRendition.value[0];
            expect(image.url).toEqual(rawImage.url);
            expect(renditions).toBeNull();
        });

        it(`Asset element with rendition in default preset - URL including rendition query string`, () => {
            const asset = item.elements.assetWithRenditionInDefaultPreset as Elements.AssetsElement;
            const image = asset.value[0];
            const rendition = image.renditions?.default;

            const rawImage = responseJson.item.elements.assetWithRenditionInDefaultPreset.value[0];
            const rawRendition = rawImage.renditions.default;

            expect(image.url).toEqual(`${rawImage.url}?${rawRendition.query}`);
            expect(rendition?.url).toEqual(`${rawImage.url}?${rawRendition.query}`);
        });

        it(`Asset element with rendition in mobile preset - URL of original asset`, () => {
            const asset = item.elements.assetWithRenditionInMobilePreset as Elements.AssetsElement;
            const image = asset.value[0];
            const rendition = image.renditions?.mobile;

            const rawImage = responseJson.item.elements.assetWithRenditionInMobilePreset.value[0];
            const rawRendition = rawImage.renditions.mobile;
            expect(image.url).toEqual(rawImage.url);
            expect(rendition?.url).toEqual(`${rawImage.url}?${rawRendition.query}`);
        });
    });
});
