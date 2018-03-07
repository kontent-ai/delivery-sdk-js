import { Context, Movie, setup } from '../../setup';

describe('Retry functionality', () => {

    const context = new Context();

    const retryAttempts = 3;

    // set retry attempts
    context.retryAttempts = retryAttempts;

    // disable advanced logging as it makes test fail (not sure why as it uses console.error and not console.warn)
    context.enableAdvancedLogging = false;

    // set fake base url because we want this to fail
    context.baseUrl = 'http://fakeurl';

    setup(context);

    let originalTimeout;

    // create spy for warn commands
    console.warn = jasmine.createSpy('warn');

    beforeEach(function () {
        // increase jasmine interval otherwise this might timeout due to retry attempts
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    beforeAll((done) => {
        // this will fail
        context.deliveryClient.items()
            .get()
            .subscribe(response => {
                done();
            }, err => {
                done();
            });
    });

    it(`Warning for retry attempt should have been called '${retryAttempts}' times`, () => {
        expect(console.warn).toHaveBeenCalledTimes(retryAttempts);
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});

