// setup
import { setup, Context } from '../../setup';

// models
import { FieldModels, Fields } from '../../../lib';

// tests
describe('MultipleChoiceField', () => {

    var multipleChoiceValue = [
        {
            "name": "Action",
            "codename": "action"
        },
        {
            "name": "Drama",
            "codename": "drama"
        }
    ];

    var field = new Fields.MultipleChoiceField('name', multipleChoiceValue);

    it(`checks name`, () => {
        expect(field.name).toEqual(field.name);
    });

    it(`checks value`, () => {
        expect(field.value).toEqual(multipleChoiceValue);
    });

    it(`checks that options are defined`, () => {
        expect(field.options).toBeDefined();
    });

    it(`checks that correct number of options are created`, () => {
        expect(field.options.length).toEqual(2);
    });

    it(`checks that options are of 'MultipleChoiceOption' type`, () => {
        expect(field.options[0]).toEqual(jasmine.any(FieldModels.MultipleChoiceOption));
    });

    it(`checks name of the option`, () => {
        expect(field.options[0].name).toEqual(multipleChoiceValue[0].name);
    });

    it(`checks codename of option`, () => {
        expect(field.options[0].codename).toEqual(multipleChoiceValue[0].codename);
    });
});

