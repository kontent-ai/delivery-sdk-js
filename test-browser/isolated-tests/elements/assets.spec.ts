import { ElementContracts, ElementModels, Elements } from '../../../lib';

describe('AssetElement', () => {

    const rawAssetValue: ElementContracts.IAssetContract[] = [
        {
            'name': 'tom_hardy.jpg',
            'type': 'image/jpeg',
            'size': 8091,
            'description': 'description',
            'height': 122,
            'width': 9,
            'url': 'https://assets.kenticocloud.com:443/da5abe9f-fdad-4168-97cd-b3464be2ccb9/bb0899cf-2c3a-4e3f-8962-60e5a54fcca5/tom_hardy.jpg'
        }
    ];

    const expectedValue: ElementModels.AssetModel[] = [
        new ElementModels.AssetModel(rawAssetValue[0])
    ];

    const element = new Elements.AssetsElement({
        contentItemSystem: {} as any,
        rawElement: {
            name: 'name',
            type: '',
            value: rawAssetValue
        },
        propertyName: 'name'
    });


    it(`checks name`, () => {
        expect(element.name).toEqual('name');
    });

    it(`checks value`, () => {
        expect(element.value).toEqual(expectedValue);
    });

    it(`checks that assets are defined`, () => {
        expect(element.value).toBeDefined();
    });

    it(`checks that correct number of assets are created`, () => {
        expect(element.value.length).toEqual(1);
    });

    it(`checks that asset is of 'AssetModel' type`, () => {
        expect(element.value[0]).toEqual(jasmine.any(ElementModels.AssetModel));
    });

    it(`checks name of asset`, () => {
        expect(element.value[0].name).toEqual(rawAssetValue[0].name);
    });

    it(`checks type of asset`, () => {
        expect(element.value[0].type).toEqual(rawAssetValue[0].type);
    });

    it(`checks description of asset`, () => {
        expect(element.value[0].description).toEqual(rawAssetValue[0].description);
    });

    it(`checks width`, () => {
        expect(element.value[0].width).toEqual(rawAssetValue[0].width);
    });

    it(`checks height`, () => {
        expect(element.value[0].height).toEqual(rawAssetValue[0].height);
    });

    it(`checks url of asset`, () => {
        expect(element.value[0].url).toEqual(rawAssetValue[0].url);
    });
});

