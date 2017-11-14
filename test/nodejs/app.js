
const https = require('https');
const Rx = require("rxjs");
const Kc = require('../../dist');
const HS = require('../../dist/services/http/http-nodejs.service');

const testUrl = 'https://deliver.kenticocloud.com/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items?system.type=movie';
const projectId = 'da5abe9f-fdad-4168-97cd-b3464be2ccb9';

class Movie extends Kc.ContentItem {

}

class Actor extends Kc.ContentItem {

}

const defaultTypeResolvers = [
  new Kc.TypeResolver("movie", () => new Movie()),
  new Kc.TypeResolver("actor", () => new Actor())
];

const config = new Kc.DeliveryClientConfig(projectId, defaultTypeResolvers);

const deliveryClient = new Kc.DeliveryClient(config, true);

deliveryClient.items().type('movie').get().subscribe(response => {

  var item = response.items[0];

  if (item && item instanceof Movie) {
    console.log('Node.js test successful');
  }
  else {
    console.log('Node.js test was NOT successful. Response contain unexpected data');
  }
},
  err => {
    console.log('Node.js test was NOT successful. Got error: ');
    console.log(err);
  })
