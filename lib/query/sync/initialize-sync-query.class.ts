import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    Filters,
    IDeliveryNetworkResponse,
    ILanguagesQueryConfig,
    ISyncInitQueryConfig,
    Parameters,
    Responses
} from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class InitializeSyncQuery extends BaseQuery<
    Responses.IInitializeSyncResponse,
    ISyncInitQueryConfig,
    Contracts.IInitializeSyncContract
> {
    protected readonly endpoint: string = 'sync/init';

    protected _queryConfig: ILanguagesQueryConfig = {};

    constructor(protected config: IDeliveryClientConfig, protected queryService: QueryService) {
        super(config, queryService);
    }

    /**
     * Gets only item of given type
     * @param type Codename of type to get
     */
    type(type: string): this {
        this.parameters.push(new Filters.TypeFilter(type));
        return this;
    }

    /**
     * Gets only item from given collection
     * @param collection Codename of collection to get
     */
    collection(collection: string): this {
        this.parameters.push(new Filters.CollectionFilter(collection));
        return this;
    }

    /**
     * Language codename
     * @param languageCodename Codename of the language
     */
    languageParameter(languageCodename: string): this {
        this.parameters.push(new Parameters.LanguageParameter(languageCodename));
        return this;
    }

    toPromise(): Promise<
        IDeliveryNetworkResponse<Responses.IInitializeSyncResponse, Contracts.IInitializeSyncContract>
    > {
        return this.queryService.initializeSync(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/' + this.endpoint;

        return super.resolveUrlInternal(action);
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: ISyncInitQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    map(json: any): Responses.IInitializeSyncResponse {
        return this.queryService.mappingService.initializeContentSync(json);
    }
}
