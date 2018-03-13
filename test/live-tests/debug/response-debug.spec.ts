import { AllTestObjects, Context, observableFactory, setup } from '../../setup';

describe('Response debug', () => {

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
    });

    it(`(items) Debug property should be defined and should contain data`, () => {
        expect(all.items.debug).toBeDefined();
    });

    it(`(taxonomy) Debug property should be defined and should contain data`, () => {
        expect(all.taxonomy.debug).toBeDefined();
    });

    it(`(taxonomies) Debug property should be defined and should contain data`, () => {
        expect(all.taxonomies.debug).toBeDefined();
    });

    it(`(type) Debug property should be defined and should contain data`, () => {
        expect(all.type.debug).toBeDefined();
    });

    it(`(types) Debug property should be defined and should contain data`, () => {
        expect(all.types.debug).toBeDefined();
    });

     it(`(element) Debug property should be defined and should contain data`, () => {
        expect(all.element.debug).toBeDefined();
    });
});

