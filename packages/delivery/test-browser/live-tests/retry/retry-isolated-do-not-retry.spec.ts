import { of, throwError } from 'rxjs';
import { catchError, retryWhen, switchMap } from 'rxjs/operators';

import { deliveryRetryStrategy } from '../../../lib';

describe('Retry - isolated - do not retry', () => {
    const retryAttempts = 3;
    const MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = MAX_SAFE_TIMEOUT;

    beforeAll((done) => {
        spyOn(deliveryRetryStrategy, 'debugLogAttempt').and.callThrough();

        // fake error
        const error: any = {
            originalError: {
                response: {
                    status: 401
                }
            }
        };

        of(true)
            .pipe(
                switchMap(() => {
                    return throwError(error);
                }),
                retryWhen(deliveryRetryStrategy.strategy({
                    maxRetryAttempts: retryAttempts,
                    useRetryForResponseCodes: [500]
                })),
                catchError((err, t) => {
                    return of(true);
                }),
        )
            .subscribe(() => done());

    });

    it(`Warning for retry attempt should have been called '${retryAttempts}' times`, () => {
        expect(deliveryRetryStrategy.debugLogAttempt).toHaveBeenCalledTimes(0);
    });
});

