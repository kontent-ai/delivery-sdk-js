import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    IContentItem,
    IItemQueryConfig,
    IDeliveryNetworkResponse,
    Responses,
    Parameters,
    ClientTypes
} from '../../models';
import { QueryService } from '../../services';
import { BaseQuery } from '../common/base-query.class';

export class SingleItemQuery<
    TClientTypes extends ClientTypes,
    TContentItem extends IContentItem = IContentItem
> extends BaseQuery<
    TClientTypes,
    Responses.IViewContentItemResponse<TContentItem>,
    IItemQueryConfig,
    Contracts.IViewContentItemContract
> {
    protected _queryConfig: IItemQueryConfig = {};

    constructor(
        protected config: IDeliveryClientConfig,
        protected queryService: QueryService<TClientTypes>,
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
    languageParameter(languageCodename: TClientTypes['languageCodenames']): this {
        this.parameters.push(new Parameters.LanguageParameter(languageCodename));
        return this;
    }

    /**
     * Used to limit the number of elements returned by query.
     * @param elementCodenames Array of element codenames to fetch
     */
    elementsParameter(elementCodenames: TClientTypes['elementCodenames'][]): this {
        this.parameters.push(new Parameters.ElementsParameter(elementCodenames));
        return this;
    }

    /**
     * Used to exclude elements returned by query.
     * @param elementCodenames Array of element codenames to exclude
     */
    excludeElementsParameter(elementCodenames: TClientTypes['elementCodenames'][]): this {
        this.parameters.push(new Parameters.ExcludeElementsParameter(elementCodenames));
        return this;
    }

    toPromise(): Promise<
        IDeliveryNetworkResponse<Responses.IViewContentItemResponse<TContentItem>, Contracts.IViewContentItemContract>
    > {
        return this.queryService.getSingleItemAsync(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = '/items/' + this.codename;

        // add default language is necessry
        this.processDefaultLanguageParameter();

        //process client level archived item exclusion
        this.processExcludeArchivedItemsParameter();

        return super.resolveUrlInternal(action);
    }

    map(json: any): Responses.IViewContentItemResponse<TContentItem> {
        return this.queryService.mappingService.viewContentItemResponse(json);
    }
}
