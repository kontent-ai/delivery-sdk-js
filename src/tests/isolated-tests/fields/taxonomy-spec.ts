// setup
import { setup, Context } from '../../setup';

// models
import {
    TaxonomyField, TaxonomyTerm
} from '../../../../lib';

// tests
describe('TaxonomyField', () => {

    var taxonomyList = [
        ['Term 1', 'term1'],
        ['Term 2', 'term2']
    ];
    var field = new TaxonomyField('name', taxonomyList, 'taxgroup');

    it(`checks name`, () => {
        expect(field.name).toEqual('name');
    });

    it(`checks value`, () => {
        expect(field.value).toEqual('text value');
    });

    it(`checks taxonomy group`, () => {
        expect(field.taxonomyGroup).toEqual('taxgroup');
    });

    it(`checks taxonomy terms`, () => {
        var taxonomyList: TaxonomyTerm[] = [
            new TaxonomyTerm('Term 1', 'term1'),
            new TaxonomyTerm('Term 2', 'term2')
        ];
        expect(field.taxonomyTerms).toEqual(taxonomyList);
    });
});

