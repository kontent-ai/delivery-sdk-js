// test imports
import { async, TestBed } from '@angular/core/testing';

// url parser
import urlParser from 'url-parse';

// real delivery client
import { realDeliveryClient } from '../delivery-clients/real-delivery-client';

// delivery client
import { DeliveryClient } from '../../../lib';

// tests
describe('Parameters in URL', () => {

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

    it(`depth param should be set`, () => {
        var url = new URL(
            deliveryClient.item('kyle')
                .depthParameter(1)
                .toString()
        );

        var depthParamVal = url.searchParams.get('depth');

        expect(depthParamVal).toEqual('1')
    });

    it(`multiple elements param should be set`, () => {
        var url = new URL(
            deliveryClient.item('kyle')
                .elementsParameter(["elem1", "elem2"])
                .toString()
        );

        var elementsParamVal = url.searchParams.get('elements');

        expect(elementsParamVal).toEqual('elem1,elem2')
    });

    it(`single elements param should be set`, () => {
        var url = new URL(
            deliveryClient.item('kyle')
                .elementsParameter(["elem1"])
                .toString()
        );

        var elementsParamVal = url.searchParams.get('elements');

        expect(elementsParamVal).toEqual('elem1')
    });

    it(`elements parameter with empty or not set elements should throw error`, () => {
        expect(() => deliveryClient.item('kyle').elementsParameter([null]).toString()).toThrowError();
    });
});

