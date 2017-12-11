const KenticoCloud = require('../../../dist');

class Article extends KenticoCloud.ContentItem {
    constructor() {
        super();
    }
}

const config = new KenticoCloud.DeliveryClientConfig("e391c776-9d1e-4e1a-8a5a-1c327c2586b6", 
[ new KenticoCloud.TypeResolver("article", () => new Article()) ]);

const deliveryClient = new KenticoCloud.DeliveryClient(config, true);

deliveryClient.item('on_roasts')
    .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
    .depthParameter(1)
    .get()
    .subscribe(response => console.log(response.item));
