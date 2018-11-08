import { IQueryParameter, Parameters } from 'kentico-cloud-core';
import { Observable } from 'rxjs';

import { IContentManagementClientConfig } from '../config/icontent-management-client-config.interface';
import { IContentManagementQueryConfig } from '../models';
import { ContentManagementActions, contentManagementActions } from '../models/content-management-actions';
import { BaseResponses } from '../responses';
import { ContentManagementQueryService } from '../services';

export abstract class BaseQuery<TResponse extends BaseResponses.IContentManagementResponse> {

    protected queryConfig?: IContentManagementQueryConfig;
    protected parameters: IQueryParameter[] = [];
    protected actions: ContentManagementActions = contentManagementActions;
    protected customUrl?: string;

    constructor(
        protected config: IContentManagementClientConfig,
        protected queryService: ContentManagementQueryService
    ) {
    }

    /**
    * Gets url for this query
    */
    getUrl(): string {
        // use custom URL if user specified it
        if (this.customUrl) {
            return this.customUrl;
        }

        // use original url
        return this.queryService.getFullUrl(this.getAction(), this.getParameters());
    }

    /**
     * Gets Promise to resolve this query
     */
    getPromise(): Promise<TResponse> {
        return this.getObservable().toPromise();
    }

    /**
     * Sets query configuration
     * @param config Query configuration object
     */
    withQueryConfig(config: IContentManagementQueryConfig): this {
        this.queryConfig = config;
        return this;
    }

    /**
     * Sets custom query parmeter that will be added to URL
     * @param name Parameter name
     * @param value Parameter value
     */
    withCustomParameter(name: string, value: string): this {
        this.parameters.push(new Parameters.CustomParameter(name, value));
        return this;
    }

    /**
     * Overrides default url resolver and resolves this query with a custom one
     * @param url Custom url to resolve query
     */
    withUrl(url: string): this {
        this.customUrl = url;
        return this;
    }

    /**
     * Gets parameters assigned to this query
     */
    getParameters(): IQueryParameter[] {
        return this.parameters;
    }

    /**
     * Gets Observable to resolve this query
     */
    abstract getObservable(): Observable<TResponse>;

    /**
     * Gets action for this query
     */
    protected abstract getAction(): string;


}
