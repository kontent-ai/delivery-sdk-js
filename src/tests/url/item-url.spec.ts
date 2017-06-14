// test imports
import { async, TestBed } from '@angular/core/testing';

// url parser
import urlParser from 'url-parse';

// real delivery client
import { realDeliveryClient } from '../delivery-clients/real-delivery-client';

// delivery client
import { DeliveryClient } from '../../../lib';

// tests
describe('Item URL', () => {

    var deliveryClient: DeliveryClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DeliveryClient, useValue: realDeliveryClient,
                },
            ]
        });

        deliveryClient = TestBed.get(DeliveryClient) as DeliveryClient;
    });

    it(`item query should thrown error when item's codename is not set`, () => {
        expect(() => deliveryClient.item(null)).toThrowError();
    });

    it(`item query should thrown error when item's codename is empty`, () => {
        expect(() => deliveryClient.item('')).toThrowError();
    });

    it(`item URL with 'kyle' codename should end with '/items/kyle`, () => {
        var url = new URL(deliveryClient.item('kyle').toString());
        var last11Digits = url.pathname.substr(url.pathname.length - 11);
        expect(last11Digits).toEqual(`/items/kyle`);
    });

    it(`item URL with 'arnold' codename should end with '/items/arnold'`, () => {
        var url = new URL(deliveryClient.item('arnold').toString());
        var last13Digits = url.pathname.substr(url.pathname.length - 13);
        expect(last13Digits).toEqual(`/items/arnold`);
    });
});

