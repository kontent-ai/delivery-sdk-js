import { IQueryParameter, Parameters } from '@kentico/kontent-core';
import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../config/imanagement-client-config.interface';
import { ContentManagementApiEndpoints, contentManagementApiEndpoints, IContentManagementQueryConfig } from '../models';
import { BaseResponses } from '../responses';
import { ContentManagementQueryService } from '../services';

export abstract class BaseQuery<TResponse extends BaseResponses.IContentManagementResponse> {
    protected queryConfig: IContentManagementQueryConfig = {};
    protected parameters: IQueryParameter[] = [];
    protected apiEndpoints: ContentManagementApiEndpoints = contentManagementApiEndpoints;
    protected customUrl?: string;

    constructor(
        protected config: IManagementClientConfig,
        protected queryService: ContentManagementQueryService
    ) {}

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
    toPromise(): Promise<TResponse> {
        return this.queryService.retryPromise(this.toObservable().toPromise());
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
    abstract toObservable(): Observable<TResponse>;

    /**
     * Gets action for this query
     */
    protected abstract getAction(): string;
}
