import { ClientTypes } from '../models';
import { IDeliveryClientConfig } from '../config/delivery-configs';
import { DeliveryClient } from './delivery-client';

export function createDeliveryClient<TClientTypes extends ClientTypes = ClientTypes>(
    config: IDeliveryClientConfig
): DeliveryClient<TClientTypes> {
    return new DeliveryClient(config);
}
