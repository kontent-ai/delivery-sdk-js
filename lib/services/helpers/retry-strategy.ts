import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { timer } from 'rxjs/observable/timer';
import { mergeMap } from 'rxjs/operators';

export const retryStrategy = (options: {
    maxRetryAttempts: number
    excludedStatusCodes: number[]
}) => (attempts: Observable<any>) => {
    return attempts.pipe(
        mergeMap((error, i) => {
            const retryAttempt = i + 1;
            // if maximum number of retries have been met
            // or response is a status code we don't wish to retry, throw error
            if (
                retryAttempt > options.maxRetryAttempts ||
                options.excludedStatusCodes.find(e => e === error.status)
            ) {
                return _throw(error);
            }

            // calculate retry time
            const retryTimeout = getRetryTimeout(retryAttempt);

            console.warn(
                `Attempt ${retryAttempt}: retrying in ${retryAttempt *
                retryTimeout}ms`
            );

            return timer(retryTimeout);
        })
    );
};

/**
* Calculates retry attempt timeout in ms
* @param attempt Index of the attempt to calculate increasing delay when retrying
*/
function getRetryTimeout(attempt: number): number {
    return Math.pow(2, attempt) * 100;
}
