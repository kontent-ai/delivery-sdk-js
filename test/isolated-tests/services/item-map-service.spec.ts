// setup
import { setup, Context } from '../../setup';

// models
import { ItemMapService } from '../../../lib/services/item-map.service';

// tests
describe('ItemMapService', () => {

    var context = new Context();
    setup(context);

    var itemMapService = new ItemMapService(context.getConfig());

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => itemMapService.mapSingleItem(null, null)).toThrowError();
        expect(() => itemMapService.mapSingleItem(undefined, undefined)).toThrowError();
    });
});

