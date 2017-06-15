// setup
import { setup, Context } from '../../setup';

// models
import {
  DateTimeField, 
} from '../../../../lib';

// tests
describe('DateTimeField', () => {

    var field = new DateTimeField('name', '2014-11-18T00:00:00Z');

    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

      it(`checks value`, () => {
        expect(field.value).toEqual('2014-11-18T00:00:00Z');
    });

    it(`datetime should be 'Date' type`, () => {
        expect(field.datetime).toEqual(jasmine.any(Date));
    });

     it(`verifies datetime property has corrent date assigned`, () => {
        expect(field.datetime).toEqual(new Date('2014-11-18T00:00:00Z'));
    });
});

