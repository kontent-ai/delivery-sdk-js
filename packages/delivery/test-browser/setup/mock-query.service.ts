import { IHttpService } from 'kentico-cloud-core';

import { ContentItem, IDeliveryClientConfig, IItemQueryConfig, ISDKInfo, MappingService } from '../../lib';
import { ItemResponses } from '../../lib/models/item/responses';
import { getParserAdapter } from '../../lib/parser/parser-adapter';
import { QueryService } from '../../lib/services/delivery-query.service';
import { fakeResponseFactory } from '../setup';

export class MockQueryService extends QueryService {

    constructor(
        protected config: IDeliveryClientConfig,
        protected httpService: IHttpService,
        protected sdkInfo: ISDKInfo
    ) {
        super(config, httpService, sdkInfo, new MappingService(config, getParserAdapter()));
    }

    mockGetSingleItem<TItem extends ContentItem>(json: any, queryConfig: IItemQueryConfig): ItemResponses.ViewContentItemResponse<TItem> {
        if (!queryConfig) {
            queryConfig = {};
        }

        const fakeResponse = fakeResponseFactory.getFakeSuccessResponse(json);

        return this.mappingService.viewContentItemResponse<TItem>(fakeResponse, queryConfig);
    }

    mockGetMultipleItems<TItem extends ContentItem>(json: any, queryConfig: IItemQueryConfig): ItemResponses.ListContentItemsResponse<TItem> {
        if (!queryConfig) {
            queryConfig = {};
        }

        const fakeResponse = fakeResponseFactory.getFakeSuccessResponse(json);

        return this.mappingService.listContentItemsResponse<TItem>(fakeResponse, queryConfig);
    }
}
