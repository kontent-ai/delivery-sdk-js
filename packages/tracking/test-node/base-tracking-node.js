const assert = require('assert');
const KenticoCloud = require('../_commonjs');

const client = new KenticoCloud.TrackingClient({
    projectId: 'e391c776-9d1e-4e1a-8a5a-1c327c2586b6',
});

describe('#Test create new session', () => {

    const newSessionQuery = client.recordNewSession({
        sid: '1111136b4af00000',
        uid: '111114cc62300000'
    });

    let result;

    before((done) => {
        newSessionQuery
            .getObservable()
            .subscribe(response => {
                result = response;
                done();
            }, err => { console.log(err)});
    });

    it('Response should be of proper type', () => {
        assert.ok(result);
        assert.ok((result instanceof KenticoCloud.TrackingEmptySuccessResponse));
    });

});


