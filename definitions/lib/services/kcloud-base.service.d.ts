import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { KCloudConfig } from '../config/kcloud.config';
import { ResponseSingle, ResponseMultiple } from '../models/responses';
import { IItem } from '../interfaces/iitem.interface';
import { IQueryOption } from '../interfaces/iquery-option.interface';
import { ItemMapService } from '../utility-services/item-map.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
export declare abstract class KCloudBaseService {
    protected http: Http;
    protected config: KCloudConfig;
    protected itemMapService: ItemMapService;
    constructor(http: Http, config: KCloudConfig);
    private getBaseUrl();
    private addOptionsToUrl(url, options?);
    private handleError(error);
    private getSingleResponse<TItem>(response);
    private getMultipleResponse<TItem>(response);
    protected getSingleItem<TItem extends IItem>(type: string, action: string, options?: IQueryOption[]): Observable<ResponseSingle<TItem>>;
    protected getMultipleItems<TItem extends IItem>(type: string, action: string, options?: IQueryOption[]): Observable<ResponseMultiple<TItem>>;
}
