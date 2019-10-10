import { ElementContracts, ElementModels, Elements } from '../../../lib';

describe('TaxonomyElement', () => {

    const taxonomyTermsRaw: ElementContracts.ITaxonomyTerm[] = [
        {
            'name': 'Term 1',
            'codename': 'term1'
        },
        {
            'name': 'Term 1',
            'codename': 'term1',
        }
    ];
    const expectedTaxonomyTerms: ElementModels.TaxonomyTerm[] = [
        new ElementModels.TaxonomyTerm(taxonomyTermsRaw[0].name, taxonomyTermsRaw[0].codename),
        new ElementModels.TaxonomyTerm(taxonomyTermsRaw[1].name, taxonomyTermsRaw[1].codename)

    ];
    const element = new Elements.TaxonomyElement({
        contentItemSystem: {} as any,
        propertyName: 'mappedName',
        rawElement: {
            taxonomy_group: 'taxgroup',
            name: 'name',
            type: '',
            value: taxonomyTermsRaw
        },
    });

    it(`checks name`, () => {
        expect(element.name).toEqual('name');
    });

    it(`checks value`, () => {
        expect(element.value).toEqual(expectedTaxonomyTerms);
    });

    it(`checks taxonomy group`, () => {
        expect(element.taxonomyGroup).toEqual('taxgroup');
    });

    it(`checks taxonomy terms`, () => {
        const xTaxonomyList: ElementModels.TaxonomyTerm[] = [
            new ElementModels.TaxonomyTerm('Term 1', 'term1'),
            new ElementModels.TaxonomyTerm('Term 2', 'term2')
        ];
        expect(element.value[0].codename).toEqual(xTaxonomyList[0].codename);
    });
});

