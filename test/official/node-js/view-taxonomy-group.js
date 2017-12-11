const KenticoCloud = require('../../../dist');

const config = new KenticoCloud.DeliveryClientConfig("e391c776-9d1e-4e1a-8a5a-1c327c2586b6", []);

const deliveryClient = new KenticoCloud.DeliveryClient(config, true);

deliveryClient.taxonomy('personas')
    .get()
    .subscribe(response => console.log(response.taxonomy));
