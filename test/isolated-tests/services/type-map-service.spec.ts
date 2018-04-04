
import { TypeMapService } from '../../../lib/services/type-map.service';

describe('TypeMapService', () => {

    const typeMapService = new TypeMapService();

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => typeMapService.mapSingleType(null)).toThrowError();
        expect(() => typeMapService.mapSingleType(undefined)).toThrowError();

        expect(() => typeMapService.mapSingleType({} as any)).toThrowError();

        expect(() => typeMapService.mapMultipleTypes(null)).toThrowError();
        expect(() => typeMapService.mapMultipleTypes(undefined)).toThrowError();
    });
});

