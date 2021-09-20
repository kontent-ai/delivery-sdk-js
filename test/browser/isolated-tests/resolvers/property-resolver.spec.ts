import { ContentItem, Elements, IContentItemElements, ItemResponses, sdkInfo, TypeResolver } from '../../../../lib';
import { Actor, Context, MockQueryService, setup } from '../../setup';
import { HttpService } from '@kentico/kontent-core';
import * as warriorJson from '../fake-data/fake-warrior-response.json';

interface IMockMovieElements extends IContentItemElements {
    titleTest: Elements.TextElement;
    test_released: Elements.DateTimeElement;
    justNumber: Elements.NumberElement;
}

class MockMovie extends ContentItem<IMockMovieElements> {
    constructor() {
        super({
            propertyResolver: (elementName: string) => {
                if (elementName === 'title') {
                    return 'titleTest';
                }
                if (elementName === 'released') {
                    return 'test_released';
                }
                if (elementName === 'length') {
                    return 'justNumber';
                }
                return elementName;
            }
        });
    }
}

describe('Property resolver', () => {
    const context = new Context();
    const typeResolvers: TypeResolver[] = [];
    typeResolvers.push(new TypeResolver('movie', () => new MockMovie()));
    typeResolvers.push(new TypeResolver('actor', () => new Actor()));

    context.typeResolvers = typeResolvers;
    setup(context);

    // mock query service
    const mockQueryService = new MockQueryService(context.getConfig(), new HttpService(), {
        host: sdkInfo.host,
        name: sdkInfo.name,
        version: sdkInfo.version
    });

    let response: ItemResponses.ViewContentItemResponse<IMockMovieElements>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<IMockMovieElements>(warriorJson, {});
        done();
    });

    it(`checks element is assigned #1`, () => {
        expect(response.item.elements.titleTest.value).toEqual('Warrior');
    });

    it(`checks element is assigned #2`, () => {
        expect(response.item.elements.test_released.value).toEqual(new Date('2011-09-09T00:00:00Z'));
    });

    it(`checks element is assigned #3`, () => {
        expect(response.item.elements.justNumber.value).toEqual(151);
    });
});
