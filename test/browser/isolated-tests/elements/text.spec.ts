import { Elements } from '../../../../lib';

describe('TextElement', () => {

    const element = new Elements.TextElement({
        contentItemSystem: {} as any,
        rawElement: {
            name: 'name',
            type: '',
            value: 'text value'
        },
        propertyName: 'resolvedName'
    });

    it(`checks name`, () => {
        expect(element.name).toEqual('name');
    });

    it(`checks text`, () => {
        expect(element.value).toEqual('text value');
    });
});

