import {
    DeliveryClient, TypeResolver, DeliveryClientConfig, ContentItem, SortOrder,
    ItemResponses, ElementResponses, TypeResponses, TaxonomyResponses
} from '../../lib';

import { observableFactory } from '../setup';

import { Observable } from 'rxjs/Rx';

class Article extends ContentItem {

}

// tests
describe('Official Kentico cloud examples (used in API reference https://developer.kenticocloud.com/v1/reference#delivery-api)', () => {

    /* ----------- Initial setup ----------- */
    // Create strongly typed models according to https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK#creating-models
    var typeResolvers = [
        new TypeResolver("article", () => new Article())
    ];
    var config = new DeliveryClientConfig("975bf280-fd91-488c-994c-2f04416e5ee3", typeResolvers);
    var deliveryClient = new DeliveryClient(config);

    /* ------------- Prepare responses ----------- */
    var itemResponse: ItemResponses.DeliveryItemResponse<Article>;
    var itemsResponse: ItemResponses.DeliveryItemListingResponse<Article>;
    var typeResponse: TypeResponses.DeliveryTypeResponse;
    var typesResponse: TypeResponses.DeliveryTypeListingResponse;
    var taxonomyResponse: TaxonomyResponses.TaxonomyResponse;
    var taxonomiesReponse: TaxonomyResponses.TaxonomiesResponse;
    var elementResponse: ElementResponses.ElementResponse;

    /* ------------ Prepare observables for each example -------------- */

    // View a content item
    var itemObs = deliveryClient.item<Article>('on_roasts')
        .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
        .depthParameter(1)
        .get()
        .map(response => itemResponse = response);

    // List content items
    var itemsObs = deliveryClient.items<Article>()
        .equalsFilter('system.type', 'article')
        .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
        .orderParameter('elements.post_date', SortOrder.desc)
        .limitParameter(3)
        .get()
        .map(response => itemsResponse = response);

    // List content types
    var typesObs = deliveryClient.types()
        .limitParameter(3)
        .get()
        .map(response => typesResponse = response);

    // View a content type
    var typeObs = deliveryClient.type('coffee')
        .get()
        .map(response => typeResponse = response);

    // View taxonomy
    var taxonomyObs = deliveryClient.taxonomy('personas')
        .get()
        .map(response => taxonomyResponse = response);

    // List taxonomies
    var taxonomiesObs = deliveryClient.taxonomies()
        .limitParameter(3)
        .get()
        .map(response => taxonomiesReponse = response);

    // View a content type element
    var elementObs = deliveryClient.element('coffee', 'processing')
        .get()
        .map(response => elementResponse = response);

    /* --------------- Prepare single observable ---------------- */
    var observables: Observable<any>[] = [];
    observables.push(itemObs);
    observables.push(itemsObs);
    observables.push(typeObs);
    observables.push(typesObs);
    observables.push(taxonomyObs);
    observables.push(taxonomiesObs);
    observables.push(elementObs);

    beforeAll((done) => {
        observableFactory.zipObservables(observables).subscribe(() => {
            done();
        });
    });

    it(`Checks item example`, () => {
        expect(itemResponse).toBeDefined();
        expect(itemResponse.item).toBeDefined();
    });

    it(`Checks items example`, () => {
        expect(itemsResponse).toBeDefined();
        expect(itemsResponse.items).toBeDefined();
        expect(itemsResponse.items.length).toBeGreaterThan(0);
    });

    it(`Checks type example`, () => {
        expect(typeResponse).toBeDefined();
        expect(typeResponse.type).toBeDefined();
    });

    it(`Checks types example`, () => {
        expect(typesResponse).toBeDefined();
        expect(typesResponse.types).toBeDefined();
        expect(typesResponse.types.length).toBeGreaterThan(0);
    });

    it(`Checks taxonomy example`, () => {
        expect(taxonomyResponse).toBeDefined();
        expect(taxonomyResponse.taxonomy).toBeDefined();
    });

    it(`Checks taxonomies example`, () => {
        expect(taxonomiesReponse).toBeDefined();
        expect(taxonomiesReponse.taxonomies).toBeDefined();
        expect(taxonomiesReponse.taxonomies.length).toBeGreaterThan(0);
    });

    it(`Checks element example`, () => {
        expect(elementResponse.element).toBeDefined();
    });

});

