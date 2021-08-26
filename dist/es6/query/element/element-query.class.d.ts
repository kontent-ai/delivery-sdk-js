import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { ElementResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseElementQuery } from './base-element-query.class';
export declare class ElementQuery extends BaseElementQuery<ElementResponses.ViewContentTypeElementResponse> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    private typeCodename;
    private elementCodename;
    constructor(config: IDeliveryClientConfig, queryService: QueryService, typeCodename: string, elementCodename: string);
    /**
    * Gets the runnable Observable
    */
    toObservable(): Observable<ElementResponses.ViewContentTypeElementResponse>;
    /**
    * Gets 'Url' representation of query
    */
    getUrl(): string;
}
