import { ClientTypes, IContentItem } from '../models';
import { IDeliveryClientConfig } from '../config/delivery-configs';
import { DeliveryClient } from './delivery-client';

export function createDeliveryClient<
    TClientTypes extends ClientTypes = {
        readonly contentItemType: IContentItem;
        readonly contentTypeCodenames: string;
        readonly workflowCodenames: string;
        readonly worfklowStepCodenames: string;
        readonly collectionCodenames: string;
        readonly taxonomyCodenames: string;
        readonly languageCodenames: string;
        readonly elementCodenames: string;
    }
>(config: IDeliveryClientConfig): DeliveryClient<TClientTypes> {
    return new DeliveryClient(config);
}
