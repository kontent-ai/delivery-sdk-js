import { FieldContracts, FieldModels, Fields } from '../../../lib';

describe('TaxonomyField', () => {

    const taxonomyTermsRaw: FieldContracts.ITaxonomyTerm[] = [
        {
            'name': 'Term 1',
            'codename': 'term1'
        },
        {
            'name': 'Term 1',
            'codename': 'term1',
        }
    ];
    const expectedTaxonomyTerms: FieldModels.TaxonomyTerm[] = [
        new FieldModels.TaxonomyTerm(taxonomyTermsRaw[0].name, taxonomyTermsRaw[0].codename),
        new FieldModels.TaxonomyTerm(taxonomyTermsRaw[1].name, taxonomyTermsRaw[1].codename)

    ];
    const field = new Fields.TaxonomyField({
        contentTypeSystem: {} as any,
        propertyName: 'mappedName',
        rawField: {
            taxonomy_group: 'taxgroup',
            name: 'name',
            type: '',
            value: taxonomyTermsRaw
        },
    });

    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

    it(`checks value`, () => {
        expect(field.value).toEqual(expectedTaxonomyTerms);
    });

    it(`checks taxonomy group`, () => {
        expect(field.taxonomyGroup).toEqual('taxgroup');
    });

    it(`checks taxonomy terms`, () => {
        const xTaxonomyList: FieldModels.TaxonomyTerm[] = [
            new FieldModels.TaxonomyTerm('Term 1', 'term1'),
            new FieldModels.TaxonomyTerm('Term 2', 'term2')
        ];
        expect(field.value[0].codename).toEqual(xTaxonomyList[0].codename);
    });
});

