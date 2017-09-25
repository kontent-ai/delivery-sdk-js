import { QueryService } from '../../lib/services/query.service';
import { DeliveryClientConfig } from '../../lib';

// fake ajax response
import { fakeResponseFactory } from '../setup';

// models
import { ItemResponses} from '../../lib/models/item/responses';
import { IContentItem } from '../../lib/interfaces/item/icontent-item.interface';
import { IQueryParameter } from '../../lib/interfaces/common/iquery-parameter.interface';
import { IItemQueryConfig } from '../../lib/interfaces/item/iitem-query.config';
import { ItemQueryConfig } from '../../lib/models/item/item-query.config';

// services
import { ResponseMapService } from '../../lib/services/response-map.service';

export class MockQueryService extends QueryService {

    protected responseMapService: ResponseMapService;

    constructor(
        protected config: DeliveryClientConfig
    ) {
        super(config);

        this.responseMapService = new ResponseMapService(config);
    }

    mockGetSingleItem<TItem extends IContentItem>(json: any, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemResponse<TItem> {
        if (!queryConfig) {
            queryConfig = new ItemQueryConfig();
        }

        var fakeResponse = fakeResponseFactory.getFakeSuccessResponse(json);

        return this.responseMapService.mapSingleResponse<TItem>(fakeResponse, queryConfig);
    }

    mockGetMultipleItems<TItem extends IContentItem>(json: any, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemListingResponse<TItem> {
        if (!queryConfig) {
            queryConfig = new ItemQueryConfig();
        }

        var fakeResponse = fakeResponseFactory.getFakeSuccessResponse(json);

        return this.responseMapService.mapMultipleResponse<TItem>(fakeResponse, queryConfig);
    }
}