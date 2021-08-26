import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { TypeResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseTypeQuery } from './base-type-query.class';
export declare class SingleTypeQuery extends BaseTypeQuery<TypeResponses.ViewContentTypeResponse> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    private typeCodename;
    constructor(config: IDeliveryClientConfig, queryService: QueryService, typeCodename: string);
    /**
    * Gets the runnable Observable
    */
    toObservable(): Observable<TypeResponses.ViewContentTypeResponse>;
    /**
    * Gets 'Url' representation of query
    */
    getUrl(): string;
}
