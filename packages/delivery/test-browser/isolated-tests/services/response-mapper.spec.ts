import { ResponseMapper } from '../../../lib/mappers';
import { Context, setup } from '../../setup';

describe('ResponseMapper', () => {

    const context = new Context();
    setup(context);

    const responseMapper = new ResponseMapper(context.getConfig(), context.richTextHtmlParser as any);

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => responseMapper.mapResponseDebug(null as any)).toThrowError();
        expect(() => responseMapper.mapResponseDebug(undefined as any)).toThrowError();
    });
});

