// setup
import { setup, Context, Actor, Movie, observableFactory, AllTestObjects } from '../../setup';

// models
import { ItemResponses, FieldModels, TaxonomyResponses, TypeResponses } from '../../../lib';

import { AjaxError } from 'rxjs/Rx';

// tests
describe('Response debug (TODO)', () => {

    const context = new Context();
    setup(context);

    let all: AllTestObjects;

    beforeAll((done) => {
        observableFactory.getAllTestObjects(context.deliveryClient)
            .subscribe((reponse: AllTestObjects) => {
                all = reponse;
                done();
            });
    });

    it(`(item) Debug property should be defined and should contain data`, () => {
        expect(all.item.debug).toBeDefined();
        if (all.item.debug.rawResponse instanceof AjaxError) {
            expect(all.item.debug.rawResponse.status).toEqual(200); // test some property to see if it exists
        }
    });

    it(`(items) Debug property should be defined and should contain data`, () => {
        expect(all.items.debug).toBeDefined();
        if (all.items.debug.rawResponse instanceof AjaxError) {
        expect(all.items.debug.rawResponse.status).toEqual(200); // test some property to see if it exists
        }
    });

    it(`(taxonomy) Debug property should be defined and should contain data`, () => {
        expect(all.taxonomy.debug).toBeDefined();
        if (all.taxonomy.debug.rawResponse instanceof AjaxError) {
            expect(all.taxonomy.debug.rawResponse.status).toEqual(200); // test some property to see if it exists
        }
    });

    it(`(taxonomies) Debug property should be defined and should contain data`, () => {
        expect(all.taxonomies.debug).toBeDefined();
        if (all.taxonomies.debug.rawResponse instanceof AjaxError) {
        expect(all.taxonomies.debug.rawResponse.status).toEqual(200); // test some property to see if it exists
        }
    });

    it(`(type) Debug property should be defined and should contain data`, () => {
        expect(all.type.debug).toBeDefined();
        if (all.type.debug.rawResponse instanceof AjaxError) {
        expect(all.type.debug.rawResponse.status).toEqual(200); // test some property to see if it exists
        }
    });

    it(`(types) Debug property should be defined and should contain data`, () => {
        expect(all.types.debug).toBeDefined();
        if (all.types.debug.rawResponse instanceof AjaxError) {
            expect(all.types.debug.rawResponse.status).toEqual(200); // test some property to see if it exists
        }
    });

     it(`(element) Debug property should be defined and should contain data`, () => {
        expect(all.element.debug).toBeDefined();
        if (all.element.debug.rawResponse instanceof AjaxError) {
            expect(all.element.debug.rawResponse.status).toEqual(200); // test some property to see if it exists
        }
    });
});

