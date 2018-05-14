import { ElementMapper } from '../../../lib/mappers';

describe('ElementMapper', () => {

    const elementMapper = new ElementMapper();

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => elementMapper.mapElement(null)).toThrowError();
        expect(() => elementMapper.mapElement(undefined)).toThrowError();
    });
});

