import { Elements } from '../../../lib';

describe('Unknown field', () => {

    const element = new Elements.UnknownElement({
        contentTypeSystem: {} as any,
        rawElement: {
            name: 'name',
            type: '',
            value: {
                data: 'x'
            }
        },
        propertyName: 'resolvedName'
    });

    it(`checks name`, () => {
        expect(element.name).toEqual('name');
    });

    it(`checks text`, () => {
        expect(element.value.data).toEqual('x');
    });
});

