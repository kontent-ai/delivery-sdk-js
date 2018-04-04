import { TypeResolverService } from '../../../lib/services/type-resolver.service';
import { Context, setup } from '../../setup';

describe('TypeResolverService', () => {

    const context = new Context();
    setup(context);

    const typeResolverService = new TypeResolverService(context.getConfig());

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => typeResolverService.createEmptyTypedObj(null)).toThrowError();
        expect(() => typeResolverService.createEmptyTypedObj(undefined)).toThrowError();
    });
});

