import { FieldModels, Fields, FieldContracts } from '../../../lib';

describe('MultipleChoiceField', () => {

    const multipleChoiceItemsRaw: FieldContracts.IMultipleChoiceOptionContract[] = [
        {
            'name': 'Action',
            'codename': 'action'
        },
        {
            'name': 'Drama',
            'codename': 'drama'
        }
    ];

    const multipleChoiceItemsExpected: FieldModels.MultipleChoiceOption[] = [
        new FieldModels.MultipleChoiceOption(multipleChoiceItemsRaw[0].name, multipleChoiceItemsRaw[0].codename),
        new FieldModels.MultipleChoiceOption(multipleChoiceItemsRaw[1].name, multipleChoiceItemsRaw[1].codename)
    ];

    const field = new Fields.MultipleChoiceField({
        contentTypeSystem: {} as any,
        rawField: {
            name: 'name',
            type: '',
            value: multipleChoiceItemsRaw
        },
        propertyName: 'resolvedName'
    });

    const fieldWithNoValue = new Fields.TextField({
        contentTypeSystem: {} as any,
        rawField: {
            name: 'name',
            type: '',
            value: []
        },
        propertyName: 'resolvedName'
    });

    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

    it(`checks mapped value`, () => {
        expect(field.value).toEqual(multipleChoiceItemsExpected);
    });

    it(`checks that correct number of options are created`, () => {
        expect(field.value.length).toEqual(2);
    });

    it(`checks that options are of 'MultipleChoiceOption' type`, () => {
        expect(field.value[0]).toEqual(jasmine.any(FieldModels.MultipleChoiceOption));
    });

    it(`checks name of the option`, () => {
        expect(field.value[0].name).toEqual(multipleChoiceItemsRaw[0].name);
    });

    it(`checks codename of option`, () => {
        expect(field.value[0].codename).toEqual(multipleChoiceItemsRaw[0].codename);
    });

    it(`checks that value contains empty array when no value was provided`, () => {
        expect(fieldWithNoValue.value).toBeDefined();
        expect(fieldWithNoValue.value.length).toEqual(0);
    });
});

