const KenticoCloud = require('../../../_commonjs');

class Article extends KenticoCloud.ContentItem {
    constructor() {
        super();
    }
}

const deliveryClient = new KenticoCloud.DeliveryClient({
    projectId: 'e391c776-9d1e-4e1a-8a5a-1c327c2586b6',
    typeResolvers: [ 
        new KenticoCloud.TypeResolver('article', () => new Article()) 
    ]
});

deliveryClient.item('on_roasts')
    .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
    .depthParameter(1)
    .getObservable()
    .subscribe(response => console.log(response.item));
