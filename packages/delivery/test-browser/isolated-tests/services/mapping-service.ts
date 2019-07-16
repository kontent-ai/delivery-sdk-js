import { MappingService } from '../../../lib';
import { Context, setup } from '../../setup';

describe('Mapping service', () => {

    const context = new Context();
    setup(context);

    const responseMapper = new MappingService(context.getConfig(), context.richTextHtmlParser as any);

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => responseMapper.mapResponseDebug(null as any)).toThrowError();
        expect(() => responseMapper.mapResponseDebug(undefined as any)).toThrowError();
    });
});

