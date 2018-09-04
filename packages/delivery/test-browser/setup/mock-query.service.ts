import { ContentItem, IDeliveryClientConfig, ISDKInfo, ResponseMapper } from '../../lib';
import { IItemQueryConfig } from '../../lib/interfaces/item/iitem-query.config';
import { ItemResponses } from '../../lib/models/item/responses';
import { getParserAdapter } from '../../lib/parser/parser-adapter';
import { QueryService } from '../../lib/services/query.service';
import { fakeResponseFactory } from '../setup';
import { IHttpService } from 'kentico-cloud-core';

export class MockQueryService extends QueryService {

    protected responseMapper: ResponseMapper;

    constructor(
        protected config: IDeliveryClientConfig,
        protected httpService: IHttpService,
        protected sdkInfo: ISDKInfo
    ) {
        super(config, httpService, getParserAdapter(), sdkInfo);
        this.responseMapper = new ResponseMapper(config, getParserAdapter());
    }

    mockGetSingleItem<TItem extends ContentItem>(json: any, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemResponse<TItem> {
        if (!queryConfig) {
            queryConfig = {};
        }

        const fakeResponse = fakeResponseFactory.getFakeSuccessResponse(json);

        return this.responseMapper.mapSingleResponse<TItem>(fakeResponse, queryConfig);
    }

    mockGetMultipleItems<TItem extends ContentItem>(json: any, queryConfig: IItemQueryConfig): ItemResponses.DeliveryItemListingResponse<TItem> {
        if (!queryConfig) {
            queryConfig = {};
        }

        const fakeResponse = fakeResponseFactory.getFakeSuccessResponse(json);

        return this.responseMapper.mapMultipleResponse<TItem>(fakeResponse, queryConfig);
    }
}
