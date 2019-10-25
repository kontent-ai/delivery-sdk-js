import { BaseKontentResponseStandardDebug } from '../../../lib';

describe('Base Kontent response', () => {
    it(`Debug props should be mapped when developer mode is enabled`, () => {
        const response = new BaseKontentResponseStandardDebug(
            {
                data: {},
                headers: [
                    {
                        header: 'x',
                        value: 'y'
                    }
                ],
                response: null,
                status: 200
            },
            true
        );
        expect(response.debug).toBeTruthy();

        if (response.debug) {
            expect(response.debug.headers.length).toEqual(1);
            expect(response.debug.status).toEqual(200);
        }
    });

    it(`Debug props should not be mapped when developer mode is disabled`, () => {
        const response = new BaseKontentResponseStandardDebug(
            {
                data: {},
                headers: [
                    {
                        header: 'x',
                        value: 'y'
                    }
                ],
                response: null,
                status: 200
            },
            false
        );
        expect(response.debug).toBeFalsy();
    });

    it(`X-Stale-Content should always be false when header is not present`, () => {
        const response = new BaseKontentResponseStandardDebug(
            {
                data: {},
                headers: [],
                response: null,
                status: 200
            },
            false
        );
        expect(response.hasStaleContent).toBeFalsy();
    });

    it(`X-Stale-Content should be true when header has value of 1`, () => {
        const response = new BaseKontentResponseStandardDebug(
            {
                data: {},
                headers: [
                    {
                        header: 'X-Stale-Content',
                        value: '1'
                    }
                ],
                response: {},
                status: 200
            },
            false
        );
        expect(response.hasStaleContent).toBeTruthy();
    });
});
