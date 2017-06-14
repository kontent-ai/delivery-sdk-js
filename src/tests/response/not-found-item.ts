// test imports
import { async, TestBed } from '@angular/core/testing';

// url parser
import urlParser from 'url-parse';

// error model
import { AjaxError } from 'rxjs/observable/dom/AjaxObservable';

// real delivery client
import { realDeliveryClient } from '../setup/real-delivery-client';

// delivery client
import { DeliveryClient, DeliveryItemResponse } from '../../../lib';

// models
import { Actor } from '../setup/actor.class';
import { Movie } from '../setup/movie.class';

// tests
describe('Not found item', () => {

    var invalidResponse: any;

    beforeEach((done) => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DeliveryClient, useValue: realDeliveryClient,
                },
            ]
        });

        var invalidCodename: string = '_&]!FE';

        let deliveryClient = TestBed.get(DeliveryClient) as DeliveryClient;

        deliveryClient.item<Movie>(invalidCodename)
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

