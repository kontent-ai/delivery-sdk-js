import { IHttpService } from '@kentico/kontent-core';

import { IContentItem, IDeliveryClientConfig, IItemQueryConfig, ISDKInfo, MappingService } from '../../../lib';
import { ItemResponses } from '../../../lib/models/item/responses';
import { getParserAdapter } from '../../../lib/parser/parser-adapter';
import { QueryService } from '../../../lib/services/delivery-query.service';
import { fakeResponseFactory } from '.';

export class MockQueryService extends QueryService {
    constructor(
        protected config: IDeliveryClientConfig,
        protected httpService: IHttpService<any>,
        protected sdkInfo: ISDKInfo
    ) {
        super(config, httpService, sdkInfo, new MappingService(config, getParserAdapter()));
    }

    mockGetSingleItem<TContentItem extends IContentItem<any> = IContentItem<any>>(
        json: any,
        queryConfig: IItemQueryConfig
    ): ItemResponses.IViewContentItemResponse<TContentItem> {
        if (!queryConfig) {
            queryConfig = {};
        }

        const fakeResponse = fakeResponseFactory.getFakeSuccessResponse(json);

        return this.mappingService.viewContentItemResponse<TContentItem>(fakeResponse.data, queryConfig);
    }

    mockGetMultipleItems<TContentItem extends IContentItem<any> = IContentItem<any>>(
        json: any,
        queryConfig: IItemQueryConfig
    ): ItemResponses.IListContentItemsResponse<TContentItem> {
        if (!queryConfig) {
            queryConfig = {};
        }

        const fakeResponse = fakeResponseFactory.getFakeSuccessResponse(json);

        return this.mappingService.listContentItemsResponse<TContentItem>(fakeResponse.data, queryConfig);
    }
}
