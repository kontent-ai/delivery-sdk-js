import { TaxonomyMapper } from '../../../lib/mappers';

describe('TaxonomyMapper', () => {

    const taxonomyMapper = new TaxonomyMapper();

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => taxonomyMapper.mapTaxonomy(null as any, [])).toThrowError();
        expect(() => taxonomyMapper.mapTaxonomy(undefined as any, [])).toThrowError();

        expect(() => taxonomyMapper.mapTaxonomy({} as any, null as any)).toThrowError();
        expect(() => taxonomyMapper.mapTaxonomy({} as any, undefined as any)).toThrowError();

        expect(() => taxonomyMapper.mapTaxonomy({} as any, 'test' as any)).toThrowError();

        expect(() => taxonomyMapper.mapTaxonomies(null as any)).toThrowError();
        expect(() => taxonomyMapper.mapTaxonomies(undefined as any)).toThrowError();

        expect(() => taxonomyMapper.mapTaxonomies('test' as any)).toThrowError();

    });
});

