import { BaseKontentResponse as BaseDeliveryResponse } from '../../../lib';

describe('Base Kontent response', () => {
    it(`Debug props should be mapped`, () => {
        const response = new BaseDeliveryResponse({
            data: {},
            headers: [{
                header: 'x',
                value: 'y'
            }],
            response: null,
            status: 200
        });
        expect(response.debug).toBeTruthy();
        expect(response.debug.headers.length).toEqual(1);
        expect(response.debug.status).toEqual(200);
    });

    it(`X-Stale-Content should always be false when header is not present`, () => {
        const response = new BaseDeliveryResponse({
            data: {},
            headers: [],
            response: null,
            status: 200
        });
        expect(response.hasStaleContent).toBeFalsy();
    });

    it(`X-Stale-Content should be true when header has value of 1`, () => {
        const response = new BaseDeliveryResponse({
            data: {},
            headers: [{
                header: 'X-Stale-Content',
                value: '1'
            }],
            response: {},
            status: 200
        });
        expect(response.hasStaleContent).toBeTruthy();
    });
});
