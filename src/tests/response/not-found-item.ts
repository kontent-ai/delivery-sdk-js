// setup
import { setup, Context, Actor, Movie } from '../setup';

// models
import { AjaxError } from 'rxjs/observable/dom/AjaxObservable';

// tests
describe('Not found item', () => {

    var context = new Context();
    setup(context);

    var invalidCodename: string = '_&]!FE';
    var invalidResponse: any;

    beforeAll((done) => {
        context.deliveryClient.item<Movie>(invalidCodename)
            .get()
            .subscribe(response => {
                invalidResponse = response;
                done();
            },
            err => {
                invalidResponse = err;
                done();
            });
    });

    it(`response should be an 'AjaxError'`, () => {
        expect(invalidResponse).toEqual(jasmine.any(AjaxError));
    });
});

