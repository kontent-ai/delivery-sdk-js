import { stronglyTypedResolver } from '../../../lib/resolvers';
import { Context, setup } from '../../setup';

describe('StronglyTypedResolver', () => {

    const context = new Context();
    setup(context);

    it(`should throw an Error when invalid response is given`, () => {
        expect(() => stronglyTypedResolver.createEmptyTypedObj(null as any, context.typeResolvers)).toThrowError();
        expect(() => stronglyTypedResolver.createEmptyTypedObj(undefined as any, context.typeResolvers)).toThrowError();
    });
});

