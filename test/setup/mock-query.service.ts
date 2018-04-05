import { IDeliveryClientConfig, ISdkInfo, ResponseMapper, RichTextHtmlParser } from '../../lib';
import { IContentItem } from '../../lib/interfaces/item/icontent-item.interface';
import { IItemQueryConfig } from '../../lib/interfaces/item/iitem-query.config';
import { ItemResponses } from '../../lib/models/item/responses';
import { IHttpService } from '../../lib/services/http/ihttp.service';
import { QueryService } from '../../lib/services/query.service';
import { fakeResponseFactory } from '../setup';

export class MockQueryService extends QueryService {

    protected responseMapper: ResponseMapper;

    constructor(
        protected config: IDeliveryClientConfig,
        protected httpService: IHttpService,
        protected sdkInfo: ISdkInfo
    ) {
        super(config, httpService, sdkInfo, new RichTextHtmlParser());
        this.responseMapper = new ResponseMapper(config, new RichTextHtmlParser);
    }

    mockGetSingleItem<TItem extends IContentItem>(json: any, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemResponse<TItem> {
        if (!queryConfig) {
            queryConfig = {};
        }

        const fakeResponse = fakeResponseFactory.getFakeSuccessResponse(json);

        return this.responseMapper.mapSingleResponse<TItem>(fakeResponse, queryConfig);
    }

    mockGetMultipleItems<TItem extends IContentItem>(json: any, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemListingResponse<TItem> {
        if (!queryConfig) {
            queryConfig = {};
        }

        const fakeResponse = fakeResponseFactory.getFakeSuccessResponse(json);

        return this.responseMapper.mapMultipleResponse<TItem>(fakeResponse, queryConfig);
    }
}
