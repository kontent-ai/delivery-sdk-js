import { DeliveryClient, TypeResolver, DeliveryClientConfig, ContentItem, SortOrder } from '../lib';

class Article extends ContentItem {

}

// tests
describe('Kentico cloud example tests', () => {

    beforeAll(() => {

        // Create strongly typed models according to https://github.com/Enngage/KenticoCloudDeliveryTypeScriptSDK#creating-models
        var typeResolvers = [
            new TypeResolver("article", () => new Article())
        ];
        var config = new DeliveryClientConfig("975bf280-fd91-488c-994c-2f04416e5ee3", typeResolvers);
        var deliveryClient = new DeliveryClient(config);

        // List content items
        deliveryClient.items<Article>()
            .equalsFilter('system.type', 'article')
            .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
            .orderParameter('elements.post_date', SortOrder.desc)
            .limitParameter(3)
            .get()
            .subscribe(response => console.log(response.items));

        // View a content item
        deliveryClient.item<Article>('on_roasts')
            .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
            .depthParameter(1)
            .get()
            .subscribe(response => console.log(response.item));

        // List content types
        deliveryClient.types()
            .limitParameter(3)
            .get()
            .subscribe(response => console.log(response.types));

        // View a content type
        deliveryClient.type('coffee')
            .get()
            .subscribe(response => console.log(response.type));
    });

    it(`debug`, () => {
        expect(1).toBeDefined();
    });
});

