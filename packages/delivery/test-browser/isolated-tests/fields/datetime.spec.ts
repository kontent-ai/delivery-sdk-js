import { Elements } from '../../../lib';

describe('DateTimeElement', () => {

    const element = new Elements.DateTimeElement({
        contentItemSystem: {} as any,
        rawElement: {
            name: 'name',
            type: '',
            value: '2014-11-18T00:00:00Z'
        },
        propertyName: 'resolvedName'
    });

    it(`checks name`, () => {
        expect(element.name).toEqual('name');
    });

    it(`checks value`, () => {
        expect(element.value).toEqual(new Date('2014-11-18T00:00:00Z'));
    });

    it(`datetime should be 'Date' type`, () => {
        expect(element.value).toEqual(jasmine.any(Date));
    });
});

