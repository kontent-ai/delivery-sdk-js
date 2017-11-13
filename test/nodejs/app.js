const https = require('https');
const Rx = require("rxjs");
const Kc = require('../../dist');

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

const deliveryClient = new Kc.DeliveryClient(config);

//var readFileAsObservable = Rx.Observable.bindNodeCallback(fs.readFile);

var httpGet = (callback) => {
};

/*
var getItemsObservable = Rx.Observable.bindNodeCallback(httpGet)();

getItemsObservable
  .subscribe(
  value => {
    console.log(value);
    console.log('success');
  },
  err => console.log(err)
  );
  */

/**
 * Request sample code taken from nodejs.org doc.
 * https://nodejs.org/api/http.html#http_http_get_options_callback 
 * @param {*} url 
 * @param {*} callback 
 */
function getData(url, callback) {
  https.get(testUrl, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      callback(error);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        console.log(res);
        const parsedData = JSON.parse(rawData);
        callback(parsedData);
      } catch (e) {
        callback(e);
      }
    });
  }).on('error', (e) => {
    callback(`Got error: ${e.message}`);
  });
}

function getDataObservable(url) {
  return Rx.Observable.bindNodeCallback(getData)(url);
}

var dataObservable = getDataObservable(testUrl)
  .subscribe(response => {
    console.log(response);
  },
  err => {
    console.log(err);
  });


/*

function test(datum, cb) {
  cb(null, datum);
}

var boundCallback = Rx.Observable.bindNodeCallback(test);
var results = [];
boundCallback(42)
  .subscribe(response => {
    results.push(response);
    console.log(response);
  },
  err => {
    console.log(err);
  }, () => {
    results.push('done');
    console.log('done');
  });
*/

/*
deliveryClient.items().type('movie').get().subscribe(response => {
  console.log(response);
})
*/
