import { GenericElementMapper } from '../../../../lib/mappers';

describe('GenericElementMapper', () => {

    const genericElementMapper = new GenericElementMapper();

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => genericElementMapper.mapElement(null as any)).toThrowError();
        expect(() => genericElementMapper.mapElement(undefined as any)).toThrowError();
    });
});

