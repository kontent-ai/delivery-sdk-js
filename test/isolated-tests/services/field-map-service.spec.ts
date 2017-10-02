// setup
import { setup, Context } from '../../setup';

// models
import { FieldMapService } from '../../../lib/services/field-map.service';

// tests
describe('FieldMapService', () => {

    var context = new Context();
    setup(context);

    var fieldMapService = new FieldMapService(context.getConfig());

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => fieldMapService.mapFields(null, null, null)).toThrowError();
        expect(() => fieldMapService.mapFields(undefined, undefined, undefined)).toThrowError();
    });
});

