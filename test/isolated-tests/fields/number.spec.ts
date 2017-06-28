// setup
import { setup, Context } from '../../setup';

// models
import { Fields } from '../../../lib';
// tests
describe('NumberField', () => {

    var field = new Fields.NumberField('name', 9);

    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

      it(`checks value`, () => {
        expect(field.value).toEqual(9);
    });

    it(`checks number`, () => {
        expect(field.number).toEqual(9);
    });
});

