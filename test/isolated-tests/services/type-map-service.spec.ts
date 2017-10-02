
// models
import { TypeMapService } from '../../../lib/services/type-map.service';

// tests
describe('TypeMapService', () => {

    var typeMapService = new TypeMapService();

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => typeMapService.mapSingleType(null)).toThrowError();
        expect(() => typeMapService.mapSingleType(undefined)).toThrowError();

        expect(() => typeMapService.mapMultipleTypes(null)).toThrowError();
        expect(() => typeMapService.mapMultipleTypes(undefined)).toThrowError();
    });
});

