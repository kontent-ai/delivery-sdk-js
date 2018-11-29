import { HttpService } from 'kentico-cloud-core';

import { sdkInfo, TypeResolver, ContentItem } from '../../../lib';
import { Actor, Context, MockQueryService, Movie, setup, warriorMovieWithoutModularContentJson } from '../../setup';

class CustomActor extends ContentItem {

    constructor(
        public customName: string) {
        super();
    }
}

describe('Item resolver', () => {

    const context = new Context();
    const typeResolvers: TypeResolver[] = [];
    typeResolvers.push(new TypeResolver('movie', () => new Movie()));
    typeResolvers.push(new TypeResolver('actor', () => new Actor()));

    context.typeResolvers = typeResolvers;
    setup(context);

    const mockQueryService = new MockQueryService(context.getConfig(), new HttpService(), {
        host: sdkInfo.host,
        name: sdkInfo.name,
        version: sdkInfo.version
    });

    beforeAll((done) => {
        done();
    });

    it(`Resolving linked items should throw exception because modular content item is missing (defualt behavior)`, () => {
        expect(() => {
            mockQueryService.mockGetSingleItem<Movie>(warriorMovieWithoutModularContentJson, {
            });
        }).toThrowError();
    });

    it(`Resolving linked items should throw exception because modular content item is missing and skip errors is disabled`, () => {
        expect(() => {
            mockQueryService.mockGetSingleItem<Movie>(warriorMovieWithoutModularContentJson, {
                skipMissingLinkedItems: false,
            });
        }).toThrowError();
    });

    it(`Resolving linked items should NOT throw exception because modular content item is missing when skip errors is enabled`, () => {
        mockQueryService.mockGetSingleItem<Movie>(warriorMovieWithoutModularContentJson, {
            skipMissingLinkedItems: true,
        });
        expect(() => {
            mockQueryService.mockGetSingleItem<Movie>(warriorMovieWithoutModularContentJson, {
                skipMissingLinkedItems: true,
            });
        }).not.toThrowError();
    });

    it(`Custom item resolver should be used and resolve items correctly`, () => {
        const response = mockQueryService.mockGetSingleItem<Movie>(warriorMovieWithoutModularContentJson, {
            itemResolver: (field, itemCodename , modularContent, queryConfig, rawItem) => {
                if (itemCodename === 'tom_hardy' || itemCodename === 'joel_edgerton') {
                    return {
                        item: new CustomActor('testName'),
                        useOriginalResolver: false
                    };
                }
                return {
                    item: undefined,
                    useOriginalResolver: true
                };
            }
        });

        // there should be items mapped
        expect(response.item.stars.length).toEqual(2);

        for (const star of response.item.stars) {
            expect(star).toEqual(jasmine.any(CustomActor));
            expect((star as any as CustomActor).customName).toEqual('testName');
        }

    });
});

