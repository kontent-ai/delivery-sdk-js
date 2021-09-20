import { IDeliveryClientConfig } from '../../config';
import { IContentItemElements, IItemQueryConfig, IKontentNetworkResponse, ItemResponses, Parameters } from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class SingleItemQuery<TElements extends IContentItemElements> extends BaseQuery<
    ItemResponses.ViewContentItemResponse<TElements>,
    IItemQueryConfig
> {
    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService,
        private codename: string
    ) {
        super(config, queryService);

        if (!codename) {
            throw Error(`'codename' has to be configured for 'SingleItemQuery' query`);
        }
    }

    /**
     * Indicates depth of query that affects loading of nested linked items.
     * @param depth Depth of the query (> 0)
     */
    depthParameter(depth: number): this {
        this.parameters.push(new Parameters.DepthParameter(depth));
        return this;
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: IItemQueryConfig): this {
        this._queryConfig = queryConfig;
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

    /**
     * Used to limit the number of elements returned by query.
     * @param elementCodenames Array of element codenames to fetch
     */
    elementsParameter(elementCodenames: string[]): this {
        this.parameters.push(new Parameters.ElementsParameter(elementCodenames));
        return this;
    }

    /**
     * Gets Promise
     */
    toPromise(): Promise<IKontentNetworkResponse<ItemResponses.ViewContentItemResponse<TElements>>> {
        return this.queryService.getSingleItemAsync(this.getUrl(), this._queryConfig ?? {});
    }

    /**
     * Gets 'Url' representation of query
     */
    getUrl(): string {
        const action = '/items/' + this.codename;

        // add default language is necessry
        this.processDefaultLanguageParameter();

        return super.resolveUrlInternal(action);
    }
}
