import { Fields } from '../../../lib';

describe('TextField', () => {

    const field = new Fields.TextField({
        contentTypeSystem: {} as any,
        rawField: {
            name: 'name',
            type: '',
            value: 'text value'
        },
        propertyName: 'resolvedName'
    });

    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

    it(`checks text`, () => {
        expect(field.value).toEqual('text value');
    });
});

