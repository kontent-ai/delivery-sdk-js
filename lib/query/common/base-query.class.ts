import { IHeader, IQueryParameter } from '@kontent-ai/core-sdk';

import { IDeliveryClientConfig } from '../../config';
import { IDeliveryNetworkResponse, IKontentResponse, IQueryConfig, Parameters } from '../../models';
import { QueryService } from '../../services';

export abstract class BaseQuery<TResponse extends IKontentResponse, TQueryConfig extends IQueryConfig, TContract> {
    protected parameters: IQueryParameter[] = [];
    protected customUrl?: string;
    protected abstract _queryConfig: TQueryConfig;

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {}

    /**
     * Gets URL of the query
     */
    abstract getUrl(): string;

    /**
     * Gets promise for query execution
     */
    abstract toPromise(): Promise<IDeliveryNetworkResponse<TResponse, TContract>>;

    /**
     * Maps json data to response
     */
    abstract map(json: any): TResponse;

    /**
     * Adds custom parameter to query
     * @param name Name of parameter
     * @param value Value of parameter
     */
    withCustomParameter(name: string, value: string): this {
        this.parameters.push(new Parameters.QueryParameter(name, value));
        return this;
    }

    /**
     * Adds parameter to query
     * @param name Name of parameter
     * @param value Value of parameter
     */
    withParameter(parameter: IQueryParameter): this {
        this.parameters.push(parameter);
        return this;
    }

    /**
     * Adds parameters to query
     * @param parameters Array of parameters
     */
    withParameters(parameters: IQueryParameter[]): this {
        this.parameters.push(...parameters);
        return this;
    }

    /**
     * Gets headers used by this query
     */
    getHeaders(): IHeader[] {
        return this.queryService.getHeaders(this._queryConfig, []);
    }

    /**
     * Sets request headers
     */
    withHeaders(headers: IHeader[]): this {
        const queryHeaders = this._queryConfig.customHeaders ?? [];
        queryHeaders.push(...headers);
        this._queryConfig.customHeaders = queryHeaders;
        return this;
    }

    /**
     * Sets request header
     */
    withHeader(header: IHeader): this {
        const queryHeaders = this._queryConfig.customHeaders ?? [];
        queryHeaders.push(header);
        this._queryConfig.customHeaders = queryHeaders;
        return this;
    }

    /**
     * Sets custom URL of request (overrides default URL of the query)
     */
    withCustomUrl(url: string): this {
        this.customUrl = url;
        return this;
    }

    /**
     * Gets all query parameter currently applied to query
     */
    getParameters(): IQueryParameter[] {
        return this.parameters;
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: TQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    protected resolveUrlInternal(action: string): string {
        // use custom URL if user specified it
        if (this.customUrl) {
            return this.customUrl;
        }

        // use original url
        return this.queryService.getUrl(action, this._queryConfig ?? {}, this.getParameters());
    }

    protected processDefaultLanguageParameter(): void {
        // add default language if none is specified && default language is specified globally
        if (this.config.defaultLanguage) {
            const languageParameter = this.getParameters().find((m) => m.getParam() === 'language');
            if (!languageParameter) {
                // language parameter was not specified in query, use globally defined language
                this.parameters.push(new Parameters.LanguageParameter(this.config.defaultLanguage));
            }
        }
    }
}
