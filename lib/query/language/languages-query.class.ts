import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    ClientTypes,
    IDeliveryNetworkResponse,
    ILanguage,
    ILanguagesQueryConfig,
    Parameters,
    Responses
} from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export class LanguagesQuery<TClientTypes extends ClientTypes> extends BaseListingQuery<
    TClientTypes,
    ILanguage<TClientTypes['languageCodenames']>,
    Responses.IListLanguagesResponse<TClientTypes['languageCodenames']>,
    Responses.IListLanguagesAllResponse<TClientTypes['languageCodenames']>,
    ILanguagesQueryConfig,
    Contracts.IListLanguagesContract
> {
    /**
     * Endpoint
     */
    protected readonly endpoint: string = 'languages';

    protected _queryConfig: ILanguagesQueryConfig = {};

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService<TClientTypes>) {
        super(config, queryService);
    }

    /**
     * Limits the number of taxonomies returned by query
     * @param limit Number of taxonomies to load
     */
    limitParameter(limit: number): this {
        this.parameters.push(new Parameters.LimitParameter(limit));
        return this;
    }

    /**
     * Skips the selected number of taxonomies
     * @param skip Number of taxonomies to skip
     */
    skipParameter(skip: number): this {
        this.parameters.push(new Parameters.SkipParameter(skip));
        return this;
    }

    toPromise(): Promise<
        IDeliveryNetworkResponse<
            Responses.IListLanguagesResponse<TClientTypes['languageCodenames']>,
            Contracts.IListLanguagesContract
        >
    > {
        return this.queryService.getLanguages(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/' + this.endpoint;

        return super.resolveUrlInternal(action);
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: ILanguagesQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    map(json: any): Responses.IListLanguagesResponse<TClientTypes['languageCodenames']> {
        return this.queryService.mappingService.listLanguagesResponse(json);
    }

    protected allResponseFactory(
        items: ILanguage<TClientTypes['languageCodenames']>[],
        responses: IDeliveryNetworkResponse<
            Responses.IListLanguagesResponse<TClientTypes['languageCodenames']>,
            Contracts.IListLanguagesContract
        >[]
    ): Responses.IListLanguagesAllResponse<TClientTypes['languageCodenames']> {
        return {
            items: items,
            responses: responses
        };
    }
}
