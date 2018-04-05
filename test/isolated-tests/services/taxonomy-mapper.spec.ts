import { TaxonomyMapper } from '../../../lib/mappers';

describe('TaxonomyMapper', () => {

    const taxonomyMapper = new TaxonomyMapper();

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => taxonomyMapper.mapTaxonomy(null, [])).toThrowError();
        expect(() => taxonomyMapper.mapTaxonomy(undefined, [])).toThrowError();

        expect(() => taxonomyMapper.mapTaxonomy({} as any, null)).toThrowError();
        expect(() => taxonomyMapper.mapTaxonomy({} as any, undefined)).toThrowError();

        expect(() => taxonomyMapper.mapTaxonomy({} as any, 'test' as any)).toThrowError();

        expect(() => taxonomyMapper.mapTaxonomies(null)).toThrowError();
        expect(() => taxonomyMapper.mapTaxonomies(undefined)).toThrowError();

        expect(() => taxonomyMapper.mapTaxonomies('test' as any)).toThrowError();

    });
});

