import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
    ContentItem,
    DeliveryClient,
    ElementResponses,
    IDeliveryClientConfig,
    ItemResponses,
    SortOrder,
    TaxonomyResponses,
    TypeResolver,
    TypeResponses,
} from '../../lib';
import { observableFactory } from '../setup';

class Article extends ContentItem {
}

describe('Official Kentico cloud examples (used in API reference https://developer.kenticocloud.com/v1/reference#delivery-api)', () => {

    /* ----------- Initial setup ----------- */
    // Create strongly typed models according to https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK#creating-models
    const typeResolvers = [
        new TypeResolver('article', () => new Article())
    ];
    const config: IDeliveryClientConfig = {
        projectId: '975bf280-fd91-488c-994c-2f04416e5ee3',
        typeResolvers: typeResolvers
    };
    const deliveryClient = new DeliveryClient(config);

    /* ------------- Prepare responses ----------- */
    let itemResponse: ItemResponses.DeliveryItemResponse<Article>;
    let itemsResponse: ItemResponses.DeliveryItemListingResponse<Article>;
    let typeResponse: TypeResponses.DeliveryTypeResponse;
    let typesResponse: TypeResponses.DeliveryTypeListingResponse;
    let taxonomyResponse: TaxonomyResponses.TaxonomyResponse;
    let taxonomiesReponse: TaxonomyResponses.TaxonomiesResponse;
    let elementResponse: ElementResponses.ElementResponse;

    /* ------------ Prepare observables for each example -------------- */

    // View a content item
    const itemObs = deliveryClient.item<Article>('on_roasts')
        .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
        .depthParameter(1)
        .getObservable()
        .pipe(
            map(response => itemResponse = response)
        );

    // List content items
    const itemsObs = deliveryClient.items<Article>()
        .equalsFilter('system.type', 'article')
        .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
        .orderParameter('elements.post_date', SortOrder.desc)
        .limitParameter(3)
        .getObservable()
        .pipe(
            map(response => itemsResponse = response)
        );

    // List content types
    const typesObs = deliveryClient.types()
        .limitParameter(3)
        .getObservable()
        .pipe(
            map(response => typesResponse = response)
        );

    // View a content type
    const typeObs = deliveryClient.type('coffee')
        .getObservable()
        .pipe(
            map(response => typeResponse = response)
        );

    // View taxonomy
    const taxonomyObs = deliveryClient.taxonomy('personas')
        .getObservable()
        .pipe(
            map(response => taxonomyResponse = response)
        );

    // List taxonomies
    const taxonomiesObs = deliveryClient.taxonomies()
        .limitParameter(3)
        .getObservable()
        .pipe(
            map(response => taxonomiesReponse = response)
        );

    // View a content type element
    const elementObs = deliveryClient.element('coffee', 'processing')
        .getObservable()
        .pipe(
            map(response => elementResponse = response)
        );

    /* --------------- Prepare single observable ---------------- */
    const observables: Observable<any>[] = [];
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

