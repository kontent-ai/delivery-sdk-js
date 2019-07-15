import { ContentItem, ElementDecorators, Elements, ItemResponses, sdkInfo, TypeResolver } from '../../../lib';
import { Actor, Context, MockQueryService, setup, warriorMovieJson } from '../../setup';
import { HttpService } from 'kentico-cloud-core';

class MockMovie extends ContentItem {
    public titleTest!: Elements.TextElement;

    @ElementDecorators.codename('released')
    public test_released!: Elements.DateTimeElement;

    @ElementDecorators.codename('length')
    public justNumber!: Elements.NumberElement;

    constructor() {
        super({
            propertyResolver: (elementName: string) => {
                if (elementName === 'title') {
                    return 'titleTest';
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

    let response: ItemResponses.DeliveryItemResponse<MockMovie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {});
        done();
    });

    it(`checks element is assigned #1`, () => {
        expect(response.item.titleTest.value).toEqual('Warrior');
    });

    it(`checks element is assigned #2`, () => {
        expect(response.item.test_released.value).toEqual(new Date('2011-09-09T00:00:00Z'));
    });

    it(`checks element is assigned #3`, () => {
        expect(response.item.justNumber.value).toEqual(151);
    });
});
