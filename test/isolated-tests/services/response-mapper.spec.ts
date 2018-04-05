import { ResponseMapper } from '../../../lib/mappers';
import { Context, setup } from '../../setup';

describe('ResponseMapper', () => {

    const context = new Context();
    setup(context);

    const responseMapper = new ResponseMapper(context.getConfig(), context.richTextHtmlParser);

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => responseMapper.mapResponseDebug(null)).toThrowError();
        expect(() => responseMapper.mapResponseDebug(undefined)).toThrowError();
    });
});

