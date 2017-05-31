// core
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// config
import { DeliveryClientConfig } from '../config/delivery-client.config';

// models
import { DeliveryItemListingResponse, DeliveryItemResponse } from '../models/item/responses';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { IQueryParameter } from '../interfaces/common/iquery-parameter.interface';
import { DeliveryTypeListingResponse, DeliveryTypeResponse } from '../models/type/responses';
import { EqualsFilter } from '../models/common/filters';
import { LimitParameter } from '../models/common/parameters';

// services
import { ItemMapService } from '../utility-services/item-map.service';
import { DeliveryClientBaseService } from './delivery-client-base.service';

@Injectable()
export class DeliveryClient extends DeliveryClientBaseService {

    constructor(
        protected http: Http,
        protected config: DeliveryClientConfig
    ) {
        super(http, config)
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

        // get all items if no type is specified
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