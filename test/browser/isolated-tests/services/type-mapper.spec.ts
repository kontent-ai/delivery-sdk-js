import { TypeMapper } from '../../../../lib/';

describe('TypeMapper', () => {

    const typeMapper = new TypeMapper();

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => typeMapper.mapSingleType(null as any)).toThrowError();
        expect(() => typeMapper.mapSingleType(undefined as any)).toThrowError();

        expect(() => typeMapper.mapSingleType({} as any)).toThrowError();

        expect(() => typeMapper.mapMultipleTypes(null as any)).toThrowError();
        expect(() => typeMapper.mapMultipleTypes(undefined as any)).toThrowError();
    });
});

