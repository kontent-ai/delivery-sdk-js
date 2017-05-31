// core
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// config
import { DeliveryClientConfig } from '../config/delivery-client.config';

// models
import { ResponseSingle, ResponseMultiple } from '../models/item/responses';
import { ICloudResponseSingle, ICloudResponseMultiple } from '../interfaces/item/cloud-responses';
import { Pagination } from '../models/common/pagination.class';
import { IItem } from '../interfaces/item/iitem.interface';
import { ICloudMultipleTypeResponse, ICloudSingleTypeResponse } from '../interfaces/type/cloud-responses';
import { IQueryOption } from '../interfaces/common/iquery-option.interface';
import { IType } from '../interfaces/type/itype.interface';
import { MultipleTypeResponse, SingleTypeResponse } from '../models/type/responses';

// services
import { ItemMapService } from '../utility-services/item-map.service';
import { TypeMapService } from '../utility-services/type-map.service';

// rxjs
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export abstract class DeliveryClientBaseService {

    protected itemMapService: ItemMapService;
    protected typeMapService: TypeMapService;

    constructor(
        protected http: Http,
        protected config: DeliveryClientConfig
    ) {
        this.itemMapService = new ItemMapService(config.typeResolvers);
        this.typeMapService = new TypeMapService();
    }

    private getUrl(action: string, options?: IQueryOption[]): string{
        return this.addOptionsToUrl(this.getBaseUrl() + action, options);
    }    

    private getBaseUrl(): string {
        return this.config.apiEndpoint + '/' + this.config.projectId;
    }

    private addOptionsToUrl(url: string, options?: IQueryOption[]): string {
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

    private getError(error: Response | any): any {
        if (this.config.logErrorsToConsole) {
            console.error(error);
        }

        return error;
    }

    private getSingleTypeResponse(response: Response): SingleTypeResponse {
        var cloudResponse = (response.json() || {}) as ICloudSingleTypeResponse;

        // map type
        var type = this.typeMapService.mapSingleType(cloudResponse);

        return new SingleTypeResponse(type);
    }

    private getMultipleTypeResponse(response: Response, options?: IQueryOption[]): MultipleTypeResponse {
        var cloudResponse = (response.json() || {}) as ICloudMultipleTypeResponse;

        // map types
        var types = this.typeMapService.mapMultipleTypes(cloudResponse);

        // pagination
        var pagination = new Pagination(
            cloudResponse.pagination.skip,
            cloudResponse.pagination.limit,
            cloudResponse.pagination.count,
            cloudResponse.pagination.next_page
        );

        return new MultipleTypeResponse(types, pagination);
    }

    private getSingleResponse<TItem extends IItem>(response: Response): ResponseSingle<TItem> {
        var cloudResponse = (response.json() || {}) as ICloudResponseSingle;

        // map item
        var item = this.itemMapService.mapSingleItem<TItem>(cloudResponse);

        return new ResponseSingle(item);
    }

    private getMultipleResponse<TItem extends IItem>(response: Response): ResponseMultiple<TItem> {
        var cloudResponse = (response.json() || {}) as ICloudResponseMultiple;

        // map items
        var items = this.itemMapService.mapMultipleItems<TItem>(cloudResponse);

        // pagination
        var pagination = new Pagination(
            cloudResponse.pagination.skip,
            cloudResponse.pagination.limit,
            cloudResponse.pagination.count,
            cloudResponse.pagination.next_page
        );

        return new ResponseMultiple(items, pagination);
    }

    protected getSingleItem<TItem extends IItem>(action: string, options?: IQueryOption[]): Observable<ResponseSingle<TItem>> {
        var url = this.getUrl(action, options);

        return this.http.get(url)
            .map(response => {
                return this.getSingleResponse<TItem>(response)
            })
            .catch(err => {
                return Observable.throw(this.getError(err));
            });
    }

    protected getMultipleItems<TItem extends IItem>(action: string, options?: IQueryOption[]): Observable<ResponseMultiple<TItem>> {
        var url = this.getUrl(action, options);

        return this.http.get(url)
            .map(response => {
                return this.getMultipleResponse(response)
            })
            .catch(err => {
                return Observable.throw(this.getError(err));
            });
    }

    protected getSingleType(action: string, options?: IQueryOption[]): Observable<SingleTypeResponse> {
        var url = this.getUrl(action, options);

        return this.http.get(url)
            .map(response => {
                return this.getSingleTypeResponse(response)
            })
            .catch(err => {
                return Observable.throw(this.getError(err));
            });
    }

    protected getMultipleTypes(action: string, options?: IQueryOption[]): Observable<MultipleTypeResponse> {
        var url = this.getUrl(action, options);

        return this.http.get(url)
            .map(response => {
                return this.getMultipleTypeResponse(response)
            })
            .catch(err => {
                return Observable.throw(this.getError(err));
            });
    }
}