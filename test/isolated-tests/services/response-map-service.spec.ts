import { ResponseMapService } from '../../../lib/services/response-map.service';
import { Context, setup } from '../../setup';

describe('ResponseMapService', () => {

    const context = new Context();
    setup(context);

    const responseMapService = new ResponseMapService(context.getConfig(), context.richTextHtmlParser);

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => responseMapService.mapResponseDebug(null)).toThrowError();
        expect(() => responseMapService.mapResponseDebug(undefined)).toThrowError();
    });
});

