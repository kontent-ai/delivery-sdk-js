import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { KCloudConfig } from '../config/kcloud.config';
import { ResponseSingle, ResponseMultiple } from '../models/responses';
import { IItem } from '../interfaces/iitem.interface';
import { IQueryOption } from '../interfaces/iquery-option.interface';
import { KCloudBaseService } from './kcloud-base.service';
export declare class KCloudService extends KCloudBaseService {
    protected http: Http;
    protected config: KCloudConfig;
    constructor(http: Http, config: KCloudConfig);
    getItems<TItem extends IItem>(type: string, options?: IQueryOption[]): Observable<ResponseMultiple<TItem>>;
    getItemByCodename<TItem extends IItem>(type: string, codename: string, options?: IQueryOption[]): Observable<ResponseSingle<TItem>>;
    getItemById<TItem extends IItem>(type: string, id: string, options?: IQueryOption[]): Observable<ResponseSingle<TItem>>;
}
