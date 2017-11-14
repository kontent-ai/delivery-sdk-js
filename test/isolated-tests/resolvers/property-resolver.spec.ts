// setup
import { setup, Context, MockQueryService, Actor, warriorMovieJson } from '../../setup';

// models
import {
    Fields, ContentItem, ContentItemSystemAttributes, ItemResponses, TypeResolver, FieldDecorators
} from '../../../lib';

class MockMovie extends ContentItem {
    public titleTest: Fields.TextField;

    @FieldDecorators.codeName('released')
    public test_released: Fields.DateTimeField;
    
    @FieldDecorators.codeName('length')
    public justNumber: Fields.NumberField;

    constructor() {
        super({
            propertyResolver: (fieldName: string) => {
                if (fieldName === 'title') {
                    return 'titleTest';
                }
            }
        })
    }
}
// tests
describe('Property resolver', () => {

    var context = new Context();
    var typeResolvers = [];
    typeResolvers.push(new TypeResolver('movie', () => new MockMovie()))
    typeResolvers.push(new TypeResolver('actor', () => new Actor()))

    context.typeResolvers = typeResolvers;
    setup(context);

    // mock query service
    var mockQueryService = new MockQueryService(context.getConfig())

    var response: ItemResponses.DeliveryItemResponse<MockMovie>;

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {});
        done();
    })

    it(`checks field is assigned #1`, () => {
        expect(response.item.titleTest.text).toEqual('Warrior');
    });

    it(`checks field is assigned #2`, () => {
        expect(response.item.test_released.datetime).toEqual(new Date('2011-09-09T00:00:00Z'));
    });

    it(`checks field is assigned #3`, () => {
        expect(response.item.justNumber.number).toEqual(151);
    });
});
