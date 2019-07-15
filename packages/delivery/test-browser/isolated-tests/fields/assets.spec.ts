import { FieldContracts, FieldModels, Fields } from '../../../lib';

describe('AssetField', () => {

    const rawAssetValue: FieldContracts.IAssetContract[] = [
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

    const expectedValue: FieldModels.AssetModel[] = [
        new FieldModels.AssetModel(rawAssetValue[0])
    ];

    const field = new Fields.AssetsField({
        contentTypeSystem: {} as any,
        rawField: {
            name: 'name',
            type: '',
            value: rawAssetValue
        },
        propertyName: 'name'
    });


    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

    it(`checks value`, () => {
        expect(field.value).toEqual(expectedValue);
    });

    it(`checks that assets are defined`, () => {
        expect(field.value).toBeDefined();
    });

    it(`checks that correct number of assets are created`, () => {
        expect(field.value.length).toEqual(1);
    });

    it(`checks that asset is of 'AssetModel' type`, () => {
        expect(field.value[0]).toEqual(jasmine.any(FieldModels.AssetModel));
    });

    it(`checks name of asset`, () => {
        expect(field.value[0].name).toEqual(rawAssetValue[0].name);
    });

    it(`checks type of asset`, () => {
        expect(field.value[0].type).toEqual(rawAssetValue[0].type);
    });

    it(`checks description of asset`, () => {
        expect(field.value[0].description).toEqual(rawAssetValue[0].description);
    });

    it(`checks width`, () => {
        expect(field.value[0].width).toEqual(rawAssetValue[0].width);
    });

    it(`checks height`, () => {
        expect(field.value[0].height).toEqual(rawAssetValue[0].height);
    });

    it(`checks url of asset`, () => {
        expect(field.value[0].url).toEqual(rawAssetValue[0].url);
    });
});

