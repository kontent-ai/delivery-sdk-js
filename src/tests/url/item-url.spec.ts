// test imports
import { async, TestBed } from '@angular/core/testing';

// url parser
import urlParser from 'url-parse';

// real delivery client
import { realDeliveryClient, realDeliveryClientConfig } from '../delivery-clients/real-delivery-client';

// delivery client
import { DeliveryClient, DeliveryClientConfig } from '../../../lib';

// tests
describe('Item URL', () => {

    var deliveryClient: DeliveryClient;
    var deliveryClientConfig: DeliveryClientConfig = this.deliveryClientConfig;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DeliveryClient, useValue: realDeliveryClient,
                },
                {
                    provide: DeliveryClientConfig, useValue: realDeliveryClientConfig,
                }
            ]
        });

        deliveryClientConfig = TestBed.get(DeliveryClientConfig) as DeliveryClientConfig;
        deliveryClient = TestBed.get(DeliveryClient) as DeliveryClient;
    });

    it(`item query should thrown error when item's codename is not set`, () => {
        expect(() => deliveryClient.item(null)).toThrowError();
    });

    it(`item query should thrown error when item's codename is empty`, () => {
        expect(() => deliveryClient.item('')).toThrowError();
    });

    it(`basic item URL with 'kyle' codename`, () => {
        var url = new URL(deliveryClient.item('kyle').toString());
        expect(url.pathname).toEqual(`/${deliveryClientConfig.projectId}/items/kyle`);
    });

    it(`basic item URL with 'arnold' codename`, () => {
        var url = new URL(deliveryClient.item('arnold').toString());
        expect(url.pathname).toEqual(`/${deliveryClientConfig.projectId}/items/arnold`);
    });
});

