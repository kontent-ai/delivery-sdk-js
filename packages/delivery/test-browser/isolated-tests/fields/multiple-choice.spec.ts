import { ElementModels, Elements, ElementContracts } from '../../../lib';

describe('MultipleChoiceElement', () => {

    const multipleChoiceItemsRaw: ElementContracts.IMultipleChoiceOptionContract[] = [
        {
            'name': 'Action',
            'codename': 'action'
        },
        {
            'name': 'Drama',
            'codename': 'drama'
        }
    ];

    const multipleChoiceItemsExpected: ElementModels.MultipleChoiceOption[] = [
        new ElementModels.MultipleChoiceOption(multipleChoiceItemsRaw[0].name, multipleChoiceItemsRaw[0].codename),
        new ElementModels.MultipleChoiceOption(multipleChoiceItemsRaw[1].name, multipleChoiceItemsRaw[1].codename)
    ];

    const element = new Elements.MultipleChoiceElement({
        contentTypeSystem: {} as any,
        rawElement: {
            name: 'name',
            type: '',
            value: multipleChoiceItemsRaw
        },
        propertyName: 'resolvedName'
    });

    const elementWithNoValue = new Elements.TextElement({
        contentTypeSystem: {} as any,
        rawElement: {
            name: 'name',
            type: '',
            value: []
        },
        propertyName: 'resolvedName'
    });

    it(`checks name`, () => {
        expect(element.name).toEqual('name');
    });

    it(`checks mapped value`, () => {
        expect(element.value).toEqual(multipleChoiceItemsExpected);
    });

    it(`checks that correct number of options are created`, () => {
        expect(element.value.length).toEqual(2);
    });

    it(`checks that options are of 'MultipleChoiceOption' type`, () => {
        expect(element.value[0]).toEqual(jasmine.any(ElementModels.MultipleChoiceOption));
    });

    it(`checks name of the option`, () => {
        expect(element.value[0].name).toEqual(multipleChoiceItemsRaw[0].name);
    });

    it(`checks codename of option`, () => {
        expect(element.value[0].codename).toEqual(multipleChoiceItemsRaw[0].codename);
    });

    it(`checks that value contains empty array when no value was provided`, () => {
        expect(elementWithNoValue.value).toBeDefined();
        expect(elementWithNoValue.value.length).toEqual(0);
    });
});

