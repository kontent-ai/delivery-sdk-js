import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { LanguageResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseLanguageQuery } from './base-language-query.class';
export declare class LanguagesQuery extends BaseLanguageQuery<LanguageResponses.ListLanguagesResponse> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    constructor(config: IDeliveryClientConfig, queryService: QueryService);
    /**
     * Limits the number of taxonomies returned by query
     * @param limit Number of taxonomies to load
     */
    limitParameter(limit: number): this;
    /**
     * Skips the selected number of taxonomies
     * @param skip Number of taxonomies to skip
     */
    skipParameter(skip: number): this;
    /**
     * Gets the Observable
     */
    toObservable(): Observable<LanguageResponses.ListLanguagesResponse>;
    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string;
}
