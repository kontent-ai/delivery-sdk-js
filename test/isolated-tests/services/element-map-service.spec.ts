
import { ElementMapService } from '../../../lib/services/element-map.service';

describe('ElementMapService', () => {

    const elementMapService = new ElementMapService();

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => elementMapService.mapElement(null)).toThrowError();
        expect(() => elementMapService.mapElement(undefined)).toThrowError();
    });
});

