// core
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// config
import { DeliveryClientConfig } from '../config/delivery-client.config';

// models
import { ResponseSingle, ResponseMultiple } from '../models/item/responses';
import { ICloudResponseSingle, ICloudResponseMultiple } from '../interfaces/item/cloud-responses';
import { Pagination } from '../models/item/pagination.class';
import { IItem } from '../interfaces/item/iitem.interface';
import { IItemQueryOption } from '../interfaces/item/iitem-query-option.interface';

// services
import { ItemMapService } from '../utility-services/item-map.service';

// rxjs
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export abstract class DeliveryClientBaseService {

    protected itemMapService: ItemMapService;

    constructor(
        protected http: Http,
        protected config: DeliveryClientConfig
    ) {
        this.itemMapService = new ItemMapService(config.typeResolvers);
    }

    private getBaseUrl(): string {
        return this.config.apiEndpoint + '/' + this.config.projectId;
    }

    private addOptionsToUrl(url: string, options?: IItemQueryOption[]): string {
        if (options) {
            options.forEach(filter => {
                if (url.indexOf('?') > -1) {
                    url = url + '&' + filter.GetParam() + '=' + filter.GetParamValue();
                }
                else {
                    url = url + '?' + filter.GetParam() + '=' + filter.GetParamValue();
                }
            });
        }
        return url;
    }

    private handleError(error: Response | any): Observable<any> {
        var errMsg: string;

        if (error instanceof Response) {
            errMsg = `$Kentico Cloud service error: ${error.status} - ${error.statusText || ''} ${error}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        return Observable.throw(errMsg);
    }

    private getSingleResponse<TItem extends IItem>(response: Response): ResponseSingle<TItem> {
        var responseCloudSingle = (response.json() || {}) as ICloudResponseSingle;

        // map item
        var item = this.itemMapService.mapSingleItem<TItem>(responseCloudSingle);

        return new ResponseSingle(item);
    }

    private getMultipleResponse<TItem extends IItem>(response: Response): ResponseMultiple<TItem> {
        var responseCloudMultiple = (response.json() || {}) as ICloudResponseMultiple;

        // map items
        var items = this.itemMapService.mapMultipleItems<TItem>(responseCloudMultiple);

        // pagination
        var pagination = new Pagination(
            responseCloudMultiple.pagination.skip,
            responseCloudMultiple.pagination.limit,
            responseCloudMultiple.pagination.count,
            responseCloudMultiple.pagination.next_page
        );

        return new ResponseMultiple(items, pagination);
    }

    protected getSingleItem<TItem extends IItem>(type: string, action: string, options?: IItemQueryOption[]): Observable<ResponseSingle<TItem>> {
        var url = this.getBaseUrl() + action;

        url = this.addOptionsToUrl(url, options);

        return this.http.get(url)
            .map(response => {
                return this.getSingleResponse<TItem>(response)
            })
            .catch(response => {
                return this.handleError(response);
            });
    }

    protected getMultipleItems<TItem extends IItem>(type: string, action: string, options?: IItemQueryOption[]): Observable<ResponseMultiple<TItem>> {
        var url = this.getBaseUrl() + action;
        var that = this;

        url = this.addOptionsToUrl(url, options);

        return this.http.get(url)
            .map(response => {
                return this.getMultipleResponse(response)
            })
            .catch(response => {
                return this.handleError(response);
            });
    }
}