import { RichTextHtmlParser } from '../../../browser';
import { ElementMapper, ItemMapper } from '../../../lib/mappers';
import { Context, setup } from '../../setup';

describe('ItemMapper', () => {

    const context = new Context();
    setup(context);

    const itemMapper = new ItemMapper(context.getConfig(), context.richTextHtmlParser);

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => itemMapper.mapSingleItem(null, null)).toThrowError();
        expect(() => itemMapper.mapSingleItem(undefined, undefined)).toThrowError();
    });
});

