import { FieldModels, Fields } from '../../../lib';

describe('TaxonomyField', () => {

    const taxonomyList = [
        {
            'name': 'Term 1',
            'codename': 'term1'
        },
        {
            'name': 'Term 1',
            'codename': 'term1'
        }
    ];
    const field = new Fields.TaxonomyField('name', taxonomyList, 'taxgroup');

    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

    it(`checks value`, () => {
        expect(field.value).toEqual(taxonomyList);
    });

    it(`checks taxonomy group`, () => {
        expect(field.taxonomyGroup).toEqual('taxgroup');
    });

    it(`checks taxonomy terms`, () => {
        const xTaxonomyList: FieldModels.TaxonomyTerm[] = [
            new FieldModels.TaxonomyTerm('Term 1', 'term1'),
            new FieldModels.TaxonomyTerm('Term 2', 'term2')
        ];
        expect(field.taxonomyTerms[0].codename).toEqual(xTaxonomyList[0].codename);
    });

    it(`checks that exception is thrown when invalid value (null) is passed`, () => {
        expect(() => new Fields.TaxonomyField('name', null, 'taxgroup')).toThrowError();
    });

    it(`checks that exception is thrown when invalid value (string) is passed`, () => {
        expect(() => new Fields.TaxonomyField('name', 'test_string', 'taxgroup')).toThrowError();
    });
});

