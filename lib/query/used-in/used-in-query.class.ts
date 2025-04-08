import { Contracts } from '../../contracts';
import { IDeliveryClientConfig } from '../../config';
import {
    Filters,
    IDeliveryNetworkResponse,
    Parameters,
    Responses,
    IItemFeedQueryConfig,
    ClientTypes,
    IUsedInItemRecord,
    IQueryConfig
} from '../../models';
import { QueryService } from '../../services';
import { BaseListingQuery } from '../common/base-listing-query.class';

export type UsedInSetup = {
    readonly entity: 'asset' | 'contentItem';
    readonly codename: string;
};

export class UsedInQuery<TClientTypes extends ClientTypes> extends BaseListingQuery<
    TClientTypes,
    IUsedInItemRecord<TClientTypes>,
    Responses.IUsedInResponse<TClientTypes>,
    Responses.IUsedInAllResponse<TClientTypes>,
    IQueryConfig,
    Contracts.IUsedInItemsContract
> {
    protected _queryConfig: IQueryConfig = {};

    constructor(
        protected readonly config: IDeliveryClientConfig,
        protected readonly queryService: QueryService<TClientTypes>,
        protected readonly setup: UsedInSetup
    ) {
        super(config, queryService);
    }

    /**
     * Gets only item of given type
     * @param type Codename of type to get
     */
    type(type: TClientTypes['contentTypeCodenames']): this {
        this.parameters.push(new Filters.TypeFilter(type));
        return this;
    }

    /**
     * Gets items of given types (logical or)
     * I.e. get items of either 'Actor' or 'Movie' type
     * @param types Types to get
     */
    types(types: TClientTypes['contentTypeCodenames'][]): this {
        this.parameters.push(new Filters.TypeFilter(types));
        return this;
    }

    /**
     * Gets only item from given collection
     * @param collection Codename of collection to get
     */
    collection(collection: TClientTypes['collectionCodenames']): this {
        this.parameters.push(new Filters.CollectionFilter(collection));
        return this;
    }

    /**
     * Gets items from given collections (logical or)
     * I.e. get items of either 'default' or 'christmas-campaign' collection
     * @param collections Collections to get
     */
    collections(collections: TClientTypes['collectionCodenames'][]): this {
        this.parameters.push(new Filters.CollectionFilter(collections));
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

    toPromise(): Promise<
        IDeliveryNetworkResponse<Responses.IUsedInResponse<TClientTypes>, Contracts.IUsedInItemsContract>
    > {
        return this.queryService.getUsedIn(this.getUrl(), this._queryConfig ?? {});
    }

    getUrl(): string {
        const action = `${this.setup.entity === 'asset' ? 'assets' : 'items'}/${this.setup.codename}/used-in`;

        // add default language is necessary
        this.processDefaultLanguageParameter();

        //process client level archived item exclusion
        this.processExcludeArchivedItemsParameter();

        return super.resolveUrlInternal(action);
    }

    /**
     * Used to configure query
     * @param queryConfig Query configuration
     */
    queryConfig(queryConfig: IItemFeedQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    map(json: any): Responses.IUsedInResponse<TClientTypes> {
        return this.queryService.mappingService.usedInResponse(json);
    }

    protected allResponseFactory(
        items: IUsedInItemRecord<TClientTypes>[],
        responses: IDeliveryNetworkResponse<Responses.IUsedInResponse<TClientTypes>, Contracts.IUsedInItemsContract>[]
    ): Responses.IUsedInAllResponse<TClientTypes> {
        return {
            items: items,
            responses: responses
        };
    }
}
