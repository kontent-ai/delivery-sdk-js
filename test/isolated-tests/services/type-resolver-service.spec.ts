// setup
import { setup, Context } from '../../setup';

// models
import { TypeResolverService } from '../../../lib/services/type-resolver.service';

// tests
describe('TypeResolverService', () => {

    var context = new Context();
    setup(context);

    var typeResolverService = new TypeResolverService(context.getConfig());

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => typeResolverService.createEmptyTypedObj(null)).toThrowError();
        expect(() => typeResolverService.createEmptyTypedObj(undefined)).toThrowError();
    });
});

