import { IHeader } from '@kentico/kontent-core';


import { IDeliveryClientConfig } from '../../config';
import { IKontentResponse, IKontentResponseDebug, ILanguagesQueryConfig, LanguageResponses } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export abstract class BaseLanguageQuery<
    TResponse extends IKontentResponse<IKontentResponseDebug>
> extends BaseQuery<TResponse> {
    /**
     * Endpoint
     */
    protected readonly endpoint: string = 'languages';

    /**
     * Query configuration
     */
    protected _queryConfig: ILanguagesQueryConfig = {};

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: ILanguagesQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    /**
     * Gets headers used by this query
     */
    getHeaders(): IHeader[] {
        return this.queryService.getHeaders(this._queryConfig);
    }

    protected getLanguagesQueryUrl(): string {
        const action = '/' + this.endpoint;

        return super.resolveUrlInternal(action);
    }

    protected runLanguagesQuery(): Promise<LanguageResponses.ListLanguagesResponse> {
        return this.queryService.getLanguages(this.getLanguagesQueryUrl(), this._queryConfig);
    }
}
