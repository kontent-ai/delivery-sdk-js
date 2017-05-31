import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DeliveryClientConfig } from '../config/delivery-client.config';
import { ResponseSingle, ResponseMultiple } from '../models/item/responses';
import { IItem } from '../interfaces/item/iitem.interface';
import { IQueryOption } from '../interfaces/common/iquery-option.interface';
import { MultipleTypeResponse, SingleTypeResponse } from '../models/type/responses';
import { DeliveryClientBaseService } from './delivery-client-base.service';
export declare class DeliveryClient extends DeliveryClientBaseService {
    protected http: Http;
    protected config: DeliveryClientConfig;
    constructor(http: Http, config: DeliveryClientConfig);
    getTypes(options?: IQueryOption[]): Observable<MultipleTypeResponse>;
    getType(type: string, options?: IQueryOption[]): Observable<SingleTypeResponse>;
    getItems<TItem extends IItem>(type: string, options?: IQueryOption[]): Observable<ResponseMultiple<TItem>>;
    getItemByCodename<TItem extends IItem>(type: string, codename: string, options?: IQueryOption[]): Observable<ResponseSingle<TItem>>;
    getItemById<TItem extends IItem>(type: string, id: string, options?: IQueryOption[]): Observable<ResponseSingle<TItem>>;
}
