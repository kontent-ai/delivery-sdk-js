import { Observable, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export class DeliveryRetryStrategy {

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
                const retryTimeout = this.getRetryTimeout(retryAttempt);

                // debug log attempt
                this.debugLogAttempt(retryAttempt, retryTimeout);

                return timer(retryTimeout);
            })
        );
    }

    /**
    * Calculates retry attempt timeout in ms
    * @param attempt Index of the attempt to calculate increasing delay when retrying
    */
    getRetryTimeout(attempt: number): number {
        return Math.pow(2, attempt) * 100;
    }

    /**
     * Logs attempt in console.
     * This function is also used for testing in jasmine spy
     * @param attempt Index of attempt
     */
    debugLogAttempt(attempt: number, retryTimeout: number): void {
        console.warn(
            `Attempt ${attempt}: retrying in ${retryTimeout}ms`
        );
    }
}

export const deliveryRetryStrategy = new DeliveryRetryStrategy();
