
// models
import { ElementMapService } from '../../../lib/services/element-map.service';

// tests
describe('ElementMapService', () => {

    var elementMapService = new ElementMapService();

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => elementMapService.mapElement(null)).toThrowError();
        expect(() => elementMapService.mapElement(undefined)).toThrowError();
    });
});

