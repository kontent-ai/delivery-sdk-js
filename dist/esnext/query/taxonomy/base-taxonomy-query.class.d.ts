import { IHeader } from '@kentico/kontent-core';
import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../../config';
import { IKontentResponse, ITaxonomyQueryConfig, TaxonomyResponses, IKontentResponseDebug } from '../../models/';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';
export declare abstract class BaseTaxonomyQuery<TResponse extends IKontentResponse<IKontentResponseDebug>> extends BaseQuery<TResponse> {
    protected config: IDeliveryClientConfig;
    protected queryService: QueryService;
    /**
     * Taxonomies endpoint URL action
     */
    protected readonly taxonomiesEndpoint: string;
    /**
     * Query configuration
     */
    protected _queryConfig: ITaxonomyQueryConfig;
    constructor(config: IDeliveryClientConfig, queryService: QueryService);
    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: ITaxonomyQueryConfig): this;
    /**
     * Gets headers used by this query
     */
    getHeaders(): IHeader[];
    protected getTaxonomyQueryUrl(taxonomyCodename: string): string;
    protected getTaxonomiesQueryUrl(): string;
    protected runTaxonomyQuery(codename: string): Observable<TaxonomyResponses.ViewTaxonomyGroupResponse>;
    protected runTaxonomiesQuery(): Observable<TaxonomyResponses.ListTaxonomyGroupsResponse>;
}
