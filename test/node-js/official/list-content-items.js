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

deliveryClient.items()
    .equalsFilter('system.type', 'article')
    .elementsParameter(['title', 'summary', 'post_date', 'teaser_image'])
    .orderParameter('elements.post_date', KenticoCloud.SortOrder.desc)
    .limitParameter(3)
    .getObservable()
    .subscribe(response => console.log(response));
