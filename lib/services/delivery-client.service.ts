// core
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// config
import { DeliveryClientConfig } from '../config/delivery-client.config';

// models
import { ResponseSingle, ResponseMultiple } from '../models/responses';
import { IItem } from '../interfaces/iitem.interface';
import { IQueryOption } from '../interfaces/iquery-option.interface';

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

    getItems<TItem extends IItem>(type: string, options?: IQueryOption[]): Observable<ResponseMultiple<TItem>> {
        var action = '/items?system.type=' + type;

        return this.getMultipleItems(type, action, options);
    }

    getItemByCodename<TItem extends IItem>(type: string, codename: string, options?: IQueryOption[]): Observable<ResponseSingle<TItem>> {
        var action = '/items/' + codename;

        return this.getSingleItem(type, action, options);
    }

    getItemById<TItem extends IItem>(type: string, id: string, options?: IQueryOption[]): Observable<ResponseSingle<TItem>> {
        var action = '/items?system.type=' + type + '&system.id=' + id + '&limit=1';

        return this.getSingleItem(type, action, options);
    }
}