import { ItemMapper } from '../../../lib/mappers';
import { Context, setup } from '../../setup';

describe('ItemMapper', () => {

    const context = new Context();
    setup(context);

    const itemMapper = new ItemMapper(context.getConfig(), context.richTextHtmlParser as any);

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => itemMapper.mapSingleItemFromResponse(null as any, null as any)).toThrowError();
        expect(() => itemMapper.mapSingleItemFromResponse(undefined as any, undefined as any)).toThrowError();
    });
});

