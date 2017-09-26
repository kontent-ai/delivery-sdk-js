// setup
import { setup, Context, Actor, Movie, observableFactory, AllTestObjects } from '../../setup';

// models
import { ItemResponses, FieldModels, TaxonomyResponses, TypeResponses } from '../../../lib';

// tests
describe('Response debug', () => {

    var context = new Context();
    setup(context);

    var all: AllTestObjects;

    beforeAll((done) => {
        observableFactory.getAllTestObjects(context.deliveryClient)
            .subscribe((reponse: AllTestObjects) => {
                all = reponse;
                done();
            });
    });

    it(`(item) Debug property should be defined and should contain data`, () => {
        expect(all.item.debug).toBeDefined();
        expect(all.item.debug.status).toEqual(200); // test some property to see if it exists
    });

    it(`(items) Debug property should be defined and should contain data`, () => {
        expect(all.items.debug).toBeDefined();
        expect(all.items.debug.status).toEqual(200); // test some property to see if it exists
    });

    it(`(taxonomy) Debug property should be defined and should contain data`, () => {
        expect(all.taxonomy.debug).toBeDefined();
        expect(all.taxonomy.debug.status).toEqual(200); // test some property to see if it exists
    });

    it(`(taxonomies) Debug property should be defined and should contain data`, () => {
        expect(all.taxonomies.debug).toBeDefined();
        expect(all.taxonomies.debug.status).toEqual(200); // test some property to see if it exists
    });

    it(`(type) Debug property should be defined and should contain data`, () => {
        expect(all.type.debug).toBeDefined();
        expect(all.type.debug.status).toEqual(200); // test some property to see if it exists
    });

    it(`(types) Debug property should be defined and should contain data`, () => {
        expect(all.types.debug).toBeDefined();
        expect(all.types.debug.status).toEqual(200); // test some property to see if it exists
    });

     it(`(element) Debug property should be defined and should contain data`, () => {
        expect(all.element.debug).toBeDefined();
        expect(all.element.debug.status).toEqual(200); // test some property to see if it exists
    });

});

