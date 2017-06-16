// setup
import { setup, Context, MockQueryService, Actor, warriorMovieJson } from '../../setup';

// models
import {
    TextField, NumberField, DateTimeField, ContentItem, ContentItemSystemAttributes, DeliveryItemResponse, TypeResolver
} from '../../../../lib';

class MockMovie extends ContentItem {
    public titleTest: TextField;
    public test_released: DateTimeField;
    public justNumber: NumberField;

    constructor() {
        super({
            resolver: (fieldName: string) => {
                if (fieldName === 'title') {
                    return 'titleTest';
                }
                if (fieldName === 'released') {
                    return 'test_released';
                }
                if (fieldName === 'length') {
                    return 'justNumber';
                }
            }
        })
    }
}
// tests
describe('Model property binding', () => {

    var context = new Context();
    var typeResolvers = [];
    typeResolvers.push(new TypeResolver('movie', () => new MockMovie()))
    typeResolvers.push(new TypeResolver('actor', () => new Actor()))

    context.typeResolvers = typeResolvers;
    setup(context);

    // mock query service
    var mockQueryService = new MockQueryService(context.getConfig())

    var response: DeliveryItemResponse<MockMovie>;

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

