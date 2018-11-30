import { HttpService } from 'kentico-cloud-core';

import { ContentItem, ContentItemSystemAttributes, sdkInfo, TypeResolver } from '../../../lib';
import {
    Actor,
    Context,
    MockQueryService,
    Movie,
    setup,
    warriorMovieJson,
    warriorMovieWithoutModularContentJson,
} from '../../setup';

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
        const response = mockQueryService.mockGetSingleItem<Movie>(warriorMovieJson, {
            itemResolver: (field, rawItem, modularContent, queryConfig) => {
                if (rawItem.system.codename === 'tom_hardy' || rawItem.system.codename === 'joel_edgerton') {
                    return new CustomActor('testName');
                }
                return undefined;
            }
        });

        // there should be some items mapped
        expect(response.item.stars.length).toEqual(2);

        for (const star of response.item.stars) {

            expect(star.elements).toBeDefined();
            expect(star.system).toEqual(jasmine.any(ContentItemSystemAttributes));

            expect(star).toEqual(jasmine.any(CustomActor));
            expect((star as any as CustomActor).customName).toEqual('testName');
        }

    });

    it(`Default resolver should be used when content item resolver resolves to undefined`, () => {
        const response = mockQueryService.mockGetSingleItem<Movie>(warriorMovieJson, {
            itemResolver: (field, rawItem, modularContent, queryConfig) => {
                return undefined;
            }
        });

        // there should be some items mapped
        expect(response.item.stars.length).toEqual(2);

        for (const star of response.item.stars) {

            expect(star.elements).toBeDefined();
            expect(star.system).toEqual(jasmine.any(ContentItemSystemAttributes));

            expect(star).toEqual(jasmine.any(Actor));
        }
    });
});

