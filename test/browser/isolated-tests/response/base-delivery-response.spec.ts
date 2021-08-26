import { BaseKontentResponseStandardDebug } from '../../../../lib';

describe('Base Kontent response', () => {
    it(`Debug props should be mapped`, () => {
        const response = new BaseKontentResponseStandardDebug(
            {
                data: {},
                headers: [
                    {
                        header: 'x',
                        value: 'y'
                    }
                ],
                rawResponse: null,
                retryStrategy: {} as any,
                status: 200
            },
        );
        expect(response.debug).toBeTruthy();

        if (response.debug) {
            expect(response.debug.headers.length).toEqual(1);
            expect(response.debug.status).toEqual(200);
        }
    });

    it(`X-Stale-Content should always be false when header is not present`, () => {
        const response = new BaseKontentResponseStandardDebug(
            {
                data: {},
                headers: [],
                rawResponse: null,
                retryStrategy: {} as any,
                status: 200
            },
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
                rawResponse: {},
                retryStrategy: {} as any,
                status: 200
            },
        );
        expect(response.hasStaleContent).toBeTruthy();
    });
});
