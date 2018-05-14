import { Fields } from '../../../lib';

describe('TextField', () => {

    const field = new Fields.TextField('name', 'text value');

    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

    it(`checks value`, () => {
        expect(field.value).toEqual('text value');
    });

    it(`checks text`, () => {
        expect(field.text).toEqual('text value');
    });
});

