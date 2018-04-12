const http = require('http');
const https = require('https');
const Rx = require('rxjs');
const KenticoCloud = require('../../../_commonjs');

const testUrl = 'https://deliver.kenticocloud.com/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items?system.type=movie';
const projectId = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';

class Movie extends KenticoCloud.ContentItem {

}

class Actor extends KenticoCloud.ContentItem {

}

const deliveryClient = new KenticoCloud.DeliveryClient({
  projectId: projectId,
  typeResolvers:  [
    new KenticoCloud.TypeResolver('movie', () => new Movie()),
    new KenticoCloud.TypeResolver('actor', () => new Actor())
  ]
});


deliveryClient.items().type('movie').limitParameter(10).getObservable().subscribe(response => {

  var item = response.items[0];

  if (item && item instanceof Movie) {
    console.log('Base Node.js test successful');
  }
  else {
    console.log('Base Node.js test was NOT successful. Response contain unexpected data');
  }
},
  err => {
    console.log('Base Node.js test was NOT successful. Got error: ');
    console.log(err);
  })
