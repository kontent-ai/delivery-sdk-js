import { HttpService } from 'kentico-cloud-core';

import { ItemResponses, ITypeResolverData, sdkInfo, TypeResolver } from '../../../lib';
import { Actor, Context, MockQueryService, Movie, setup, warriorMovieJson } from '../../setup';

let movieTypeResolverData: ITypeResolverData | undefined;
let actorTypeResolverData: ITypeResolverData | undefined;

function getQueryService(advancedLogging: boolean = false): MockQueryService {
    const context = new Context();
    const typeResolvers: TypeResolver[] = [];
    typeResolvers.push(new TypeResolver('movie', (data) => {
        movieTypeResolverData = data;
        return new Movie();
    }));
    typeResolvers.push(new TypeResolver('actor', (data) => {
        actorTypeResolverData = data;
        return new Actor();
    }));

    context.typeResolvers = typeResolvers;
    setup(context);

    const config = context.getConfig();
    config.enableAdvancedLogging = advancedLogging;

    return new MockQueryService(config, new HttpService(), {
        host: sdkInfo.host,
        name: sdkInfo.name,
        version: sdkInfo.version
    });
}

describe('Type resolver data', () => {

    beforeAll((done) => {
        done();
    });

    it('Type resolver should receive item contract and modular content as data parameter', () => {
        // response has to be called so that typ resolvers are triggered
        const response: ItemResponses.DeliveryItemResponse<Movie> = getQueryService().mockGetSingleItem<Movie>(warriorMovieJson, {});
        expect(movieTypeResolverData).toBeDefined();
        expect(actorTypeResolverData).toBeDefined();

        if (movieTypeResolverData && actorTypeResolverData) {
            expect(movieTypeResolverData.item).toEqual(warriorMovieJson.item);
            expect(actorTypeResolverData.item.system.type).toEqual('actor');

            expect(movieTypeResolverData.modularContent).toEqual(warriorMovieJson.modular_content);
            expect(actorTypeResolverData.modularContent).toEqual(warriorMovieJson.modular_content);
        }
    });

});

