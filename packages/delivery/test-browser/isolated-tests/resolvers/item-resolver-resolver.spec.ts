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

function getQueryService(advancedLogging: boolean = false): MockQueryService {
    const context = new Context();
    const typeResolvers: TypeResolver[] = [];
    typeResolvers.push(new TypeResolver('movie', () => new Movie()));
    typeResolvers.push(new TypeResolver('actor', () => new Actor()));

    context.typeResolvers = typeResolvers;
    setup(context);

    const config = context.getConfig();
    config.isDeveloperMode = advancedLogging;

    return new MockQueryService(config, new HttpService(), {
        host: sdkInfo.host,
        name: sdkInfo.name,
        version: sdkInfo.version
    });
}

describe('Item resolver', () => {

    beforeAll((done) => {
        done();
    });

    it(`Resolving linked items should NOT throw exception because modular content item is missing (default behavior)`, () => {
        expect(() => {
            getQueryService().mockGetSingleItem<Movie>(warriorMovieWithoutModularContentJson, {
            });
        }).not.toThrowError();
    });

    it(`Resolving linked items should throw exception when linked item is missing and 'throwErrorForMissingLinkedItems' is enabled`, () => {
        expect(() => {
            getQueryService().mockGetSingleItem<Movie>(warriorMovieWithoutModularContentJson, {
                throwErrorForMissingLinkedItems: true,
            });
        }).toThrowError();
    });

    it(`Resolving linked items in rich text element should always throw exception because items are not present in response and could not be parsed`, () => {
        expect(() => {
            const result = getQueryService().mockGetSingleItem<Movie>(warriorMovieWithoutModularContentJson, {
                throwErrorForMissingLinkedItems: false,
            });

            result.item.plot.resolveHtml();

        }).toThrowError();
    });

    it(`Resolving linked items should NOT throw exception when linked content item is missing and 'throwErrorForMissingLinkedItems' is disabled`, () => {
        getQueryService().mockGetSingleItem<Movie>(warriorMovieWithoutModularContentJson, {
            throwErrorForMissingLinkedItems: false,
        });
        expect(() => {
            getQueryService().mockGetSingleItem<Movie>(warriorMovieWithoutModularContentJson, {
                throwErrorForMissingLinkedItems: false,
            });
        }).not.toThrowError();
    });

    it(`Custom item resolver should be used to resolve items`, () => {
        const response = getQueryService().mockGetSingleItem<Movie>(warriorMovieJson, {
            itemResolver: (element, rawItem, modularContent, queryConfig) => {
                if (rawItem.system.codename === 'tom_hardy' || rawItem.system.codename === 'joel_edgerton') {
                    return new CustomActor('testName');
                }
                return undefined;
            }
        });

        // there should be some items mapped
        expect(response.item.stars.value.length).toEqual(2);

        for (const star of response.item.stars.value) {

            expect(star.elements).toBeDefined();
            expect(star.system).toEqual(jasmine.any(ContentItemSystemAttributes));

            expect(star).toEqual(jasmine.any(CustomActor));
            expect((star as any as CustomActor).customName).toEqual('testName');
        }

    });

    it(`Default resolver should be used when content item resolver resolves to undefined`, () => {
        const response = getQueryService().mockGetSingleItem<Movie>(warriorMovieJson, {
            itemResolver: (element, rawItem, modularContent, queryConfig) => {
                return undefined;
            }
        });

        // there should be some items mapped
        expect(response.item.stars.value.length).toEqual(2);

        for (const star of response.item.stars.value) {

            expect(star._raw.elements).toBeDefined();
            expect(star.system).toEqual(jasmine.any(ContentItemSystemAttributes));

            expect(star).toEqual(jasmine.any(Actor));
        }
    });

    it(`Resolving linked items should NOT throw exception, but warning should be logged for each missing linked item`, () => {
        const expectedNumberOfWarning = 2;

        console.warn = jasmine.createSpy('warn');

        getQueryService(true).mockGetSingleItem<Movie>(warriorMovieWithoutModularContentJson, {
            throwErrorForMissingLinkedItems: false,
        });

        expect(console.warn).toHaveBeenCalledTimes(expectedNumberOfWarning); // 2 times because there are 2 missing linked items

    });

});

