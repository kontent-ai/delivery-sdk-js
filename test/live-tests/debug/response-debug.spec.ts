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
        if (all.item.debug.response instanceof AjaxError) {
            expect(all.item.debug.response.status).toEqual(200); // test some property to see if it exists
        }
    });

    it(`(items) Debug property should be defined and should contain data`, () => {
        expect(all.items.debug).toBeDefined();
        if (all.items.debug.response instanceof AjaxError) {
        expect(all.items.debug.response.status).toEqual(200); // test some property to see if it exists
        }
    });

    it(`(taxonomy) Debug property should be defined and should contain data`, () => {
        expect(all.taxonomy.debug).toBeDefined();
        if (all.taxonomy.debug.response instanceof AjaxError) {
            expect(all.taxonomy.debug.response.status).toEqual(200); // test some property to see if it exists
        }
    });

    it(`(taxonomies) Debug property should be defined and should contain data`, () => {
        expect(all.taxonomies.debug).toBeDefined();
        if (all.taxonomies.debug.response instanceof AjaxError) {
        expect(all.taxonomies.debug.response.status).toEqual(200); // test some property to see if it exists
        }
    });

    it(`(type) Debug property should be defined and should contain data`, () => {
        expect(all.type.debug).toBeDefined();
        if (all.type.debug.response instanceof AjaxError) {
        expect(all.type.debug.response.status).toEqual(200); // test some property to see if it exists
        }
    });

    it(`(types) Debug property should be defined and should contain data`, () => {
        expect(all.types.debug).toBeDefined();
        if (all.types.debug.response instanceof AjaxError) {
            expect(all.types.debug.response.status).toEqual(200); // test some property to see if it exists
        }
    });

     it(`(element) Debug property should be defined and should contain data`, () => {
        expect(all.element.debug).toBeDefined();
        if (all.element.debug.response instanceof AjaxError) {
            expect(all.element.debug.response.status).toEqual(200); // test some property to see if it exists
        }
    });
});

