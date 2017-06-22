import { QueryService } from '../../../lib/services/query.service';
import { DeliveryClientConfig } from '../../../lib';

// models
import { ItemResponses} from '../../../lib/models/item/responses';
import { IContentItem } from '../../../lib/interfaces/item/icontent-item.interface';
import { IQueryParameter } from '../../../lib/interfaces/common/iquery-parameter.interface';
import { IItemQueryConfig } from '../../../lib/interfaces/item/iitem-query.config';
import { ItemQueryConfig } from '../../../lib/models/item/item-query.config';

export class MockQueryService extends QueryService {

    constructor(
        protected config: DeliveryClientConfig
    ) {
        super(config)
    }

    mockGetSingleItem<TItem extends IContentItem>(json: any, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemResponse<TItem> {
        if (!queryConfig) {
            queryConfig = new ItemQueryConfig();
        }
        return super.getSingleResponse<TItem>(json, queryConfig);
    }

    mockGetMultipleItems<TItem extends IContentItem>(json: any, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemListingResponse<TItem> {
        if (!queryConfig) {
            queryConfig = new ItemQueryConfig();
        }
        return super.getMultipleResponse<TItem>(json, queryConfig);
    }
}