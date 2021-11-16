import { IDeliveryClientConfig } from '../config/delivery-configs';
import { DeliveryClient } from './delivery-client';

export function createDeliveryClient(config: IDeliveryClientConfig): DeliveryClient {
    return new DeliveryClient(config);
}
