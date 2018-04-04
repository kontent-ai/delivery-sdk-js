import { RichTextHtmlParser } from '../../../lib';
import { ItemMapService } from '../../../lib/services/item-map.service';
import { Context, setup } from '../../setup';

describe('ItemMapService', () => {

    const context = new Context();
    setup(context);

    const itemMapService = new ItemMapService(context.getConfig(), context.richTextHtmlParser);

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => itemMapService.mapSingleItem(null, null)).toThrowError();
        expect(() => itemMapService.mapSingleItem(undefined, undefined)).toThrowError();
    });
});

