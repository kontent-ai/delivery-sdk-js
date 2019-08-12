import { Elements } from '../../../lib';

describe('NumberElement', () => {

    const element = new Elements.NumberElement({
        contentItemSystem: {} as any,
        rawElement: {
            name: 'name',
            type: '',
            value: 9
        },
        propertyName: 'resolvedName'
    });

    it(`checks name`, () => {
        expect(element.name).toEqual('name');
    });

      it(`checks value`, () => {
        expect(element.value).toEqual(9);
    });

    it(`checks number`, () => {
        expect(element.value).toEqual(9);
    });
});

