import { Fields } from '../../../lib';

describe('DateTimeField', () => {

    const field = new Fields.DateTimeField({
        contentTypeSystem: {} as any,
        rawField: {
            name: 'name',
            type: '',
            value: '2014-11-18T00:00:00Z'
        },
        propertyName: 'resolvedName'
    });

    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

    it(`checks value`, () => {
        expect(field.value).toEqual(new Date('2014-11-18T00:00:00Z'));
    });

    it(`datetime should be 'Date' type`, () => {
        expect(field.value).toEqual(jasmine.any(Date));
    });
});

