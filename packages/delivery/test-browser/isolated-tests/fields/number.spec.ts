import { Fields } from '../../../lib';

describe('NumberField', () => {

    const field = new Fields.NumberField({
        contentTypeSystem: {} as any,
        rawField: {
            name: 'name',
            type: '',
            value: 9
        },
        propertyName: 'resolvedName'
    });

    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

      it(`checks value`, () => {
        expect(field.value).toEqual(9);
    });

    it(`checks number`, () => {
        expect(field.value).toEqual(9);
    });
});

