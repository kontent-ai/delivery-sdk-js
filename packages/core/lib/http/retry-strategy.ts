import { Observable, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { retryService} from './retry-service';

export class RetryStrategy {

    strategy = (options: {
        maxRetryAttempts: number
        useRetryForResponseCodes: number[]
    }) => (attempts: Observable<any>) => {
        return attempts.pipe(
            mergeMap((error, i) => {
                const retryAttempt = i + 1;
                // if maximum number of retries have been met
                // or response is a status code we don't wish to retry, throw error

                if (retryAttempt > options.maxRetryAttempts) {
                    // request cannot be retried anymore
                    return throwError(error);
                }

                let statusCode = 0;
                if (error && error.originalError && error.originalError.response && error.originalError.response.status) {
                    statusCode = error.originalError.response.status;
                }

                // check if request can be retried by looking into allowed retry status codes
                if (!options.useRetryForResponseCodes.find(m => m === statusCode)) {
                    // request cannot be retried
                    return throwError(error);
                }

                // calculate retry time
                const retryTimeout = retryService.getRetryTimeout(retryAttempt);

                // debug log attempt
                retryService.debugLogAttempt(retryAttempt, retryTimeout);

                return timer(retryTimeout);
            })
        );
    }
}

export const retryStrategy = new RetryStrategy();
