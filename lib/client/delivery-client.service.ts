// rxjs
import { Observable } from 'rxjs/Rx';

// config
import { DeliveryClientConfig } from '../config/delivery-client.config';

// models
import { DeliveryItemListingResponse, DeliveryItemResponse } from '../models/item/responses';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { IQueryParameter } from '../interfaces/common/iquery-parameter.interface';
import { DeliveryTypeListingResponse, DeliveryTypeResponse } from '../models/type/responses';
import { EqualsFilter } from '../models/common/filters';

// services
import { DeliveryClientBaseService } from './delivery-client-base.service';

export class DeliveryClient extends DeliveryClientBaseService {

    constructor(
        protected config: DeliveryClientConfig
    ) {
        super(config)
    }

    getTypes(options?: IQueryParameter[]): Observable<DeliveryTypeListingResponse> {
        var action = '/types';

        return super.getMultipleTypes(action, options);
    }

    getType(type: string, options?: IQueryParameter[]): Observable<DeliveryTypeResponse> {
        var action = '/types/' + type;

        return super.getSingleType(action, options);
    }

    getItems<TItem extends IContentItem>(type?: string, options?: IQueryParameter[]): Observable<DeliveryItemListingResponse<TItem>> {
        var action = '/items';

        if (!options) {
            options = [];
        }

        // get all items of all types when no type is specified
        if (type){
            options.push(new EqualsFilter("system.type", type));
        }

        return super.getMultipleItems(action, options);
    }

    getItem<TItem extends IContentItem>(type: string, codename: string, options?: IQueryParameter[]): Observable<DeliveryItemResponse<TItem>> {
        var action = '/items/' + codename;

        return super.getSingleItem(action, options);
    }
}