// config
import { DeliveryClientConfig } from '../../config/delivery-client.config';

// filters
import * as Filters from '../../models/common/filters';

// models
import { DeliveryItemListingResponse, DeliveryItemResponse } from '../../models/item/responses';
import { IContentItem } from '../../interfaces/item/icontent-item.interface';
import { IQueryParameter } from '../../interfaces/common/iquery-parameter.interface';
import { DeliveryTypeListingResponse, DeliveryTypeResponse } from '../../models/type/responses';
import { IItemQueryConfig } from '../../interfaces/item/iitem-query.config';
import { ItemQueryConfig } from '../../models/item/item-query.config';
import { IHeader } from '../../interfaces/common/iheader.interface';

// base query
import { BaseQuery } from '../common/base-query.class';

// rxjs
import { Observable } from 'rxjs/Rx';

export abstract class BaseItemQuery<TItem extends IContentItem> extends BaseQuery {

    protected parameters: IQueryParameter[] = [];

    protected _contentType?: string;
    protected _queryConfig?: IItemQueryConfig;

    constructor(
        protected config: DeliveryClientConfig,
    ) {
        super(config)
    }

    queryConfig(queryConfig: IItemQueryConfig): this {
        this._queryConfig = queryConfig;
        return this;
    }

    getHeaders(): IHeader[]{
        return super.getHeadersInternal(this.getQueryConfig());
    }

    private getQueryConfig(): IItemQueryConfig {
        // use default config if none is provider
        if (!this._queryConfig) {
            return new ItemQueryConfig();
        }

        return this._queryConfig;
    }

    protected getMultipleItemsQueryUrl(): string {
        var action = '/items';

        // get all items of all types when no type is specified
        if (this._contentType) {
            this.parameters.push(new Filters.EqualsFilter("system.type", this._contentType));
        }

        return this.getUrl(action, this.getQueryConfig(), this.parameters);
    }

    protected getSingleItemQueryUrl(codename: string): string {
        var action = '/items/' + codename;

        return this.getUrl(action, this.getQueryConfig(), this.parameters);
    }

    protected runMultipleItemsQuery(): Observable<DeliveryItemListingResponse<TItem>> {
        var url = this.getMultipleItemsQueryUrl();

        return super.getMultipleItems(url, this.getQueryConfig());
    }

    protected runSingleItemQuery(codename: string): Observable<DeliveryItemResponse<TItem>> {
        var url = this.getSingleItemQueryUrl(codename);

        return super.getSingleItem(url, this.getQueryConfig());
    }
}