import { TrackingClient, TrackingEmptySuccessResponse } from '../../lib';
import { createTestClient } from '../client-factory';
import { guidHelper } from '../utilities';
import { map } from 'rxjs/operators';

describe('New session query', () => {

    const newSessionQuery = createTestClient().recordNewSession({
        sid: guidHelper.newGuid(),
        uid: guidHelper.newGuid()
    });

    let response: TrackingEmptySuccessResponse;

    beforeAll((done) => {
        newSessionQuery
            .getObservable()
            .pipe(
                map(xResponse => {
                    response = xResponse;
                }))
            .subscribe(() => {
                done();
            });
    });

    it(`Verifies response model`, () => expect(response).toEqual(jasmine.any(TrackingEmptySuccessResponse)));

    it(`Verifies debug in response model`, () => expect(response.debug).toBeDefined());
});

