

export class RetryService {

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

export const retryService = new RetryService();
