
import { TaxonomyMapService } from '../../../lib/services/taxonomy-map.service';

describe('TaxonomyMapService', () => {

    const taxonomyMapService = new TaxonomyMapService();

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => taxonomyMapService.mapTaxonomy(null, [])).toThrowError();
        expect(() => taxonomyMapService.mapTaxonomy(undefined, [])).toThrowError();

        expect(() => taxonomyMapService.mapTaxonomy({} as any, null)).toThrowError();
        expect(() => taxonomyMapService.mapTaxonomy({} as any, undefined)).toThrowError();

        expect(() => taxonomyMapService.mapTaxonomy({} as any, 'test' as any)).toThrowError();

        expect(() => taxonomyMapService.mapTaxonomies(null)).toThrowError();
        expect(() => taxonomyMapService.mapTaxonomies(undefined)).toThrowError();

        expect(() => taxonomyMapService.mapTaxonomies('test' as any)).toThrowError();

    });
});

