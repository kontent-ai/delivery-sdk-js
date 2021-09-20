import { IHttpService } from '@kentico/kontent-core';

import { IContentItemElements, IDeliveryClientConfig, IItemQueryConfig, ISDKInfo, MappingService } from '../../../lib';
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

    mockGetSingleItem<TElements extends IContentItemElements>(
        json: any,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ViewContentItemResponse<TElements> {
        if (!queryConfig) {
            queryConfig = {};
        }

        const fakeResponse = fakeResponseFactory.getFakeSuccessResponse(json);

        return this.mappingService.viewContentItemResponse<TElements>(fakeResponse.data, queryConfig);
    }

    mockGetMultipleItems<TElements extends IContentItemElements>(
        json: any,
        queryConfig: IItemQueryConfig
    ): ItemResponses.ListContentItemsResponse<TElements> {
        if (!queryConfig) {
            queryConfig = {};
        }

        const fakeResponse = fakeResponseFactory.getFakeSuccessResponse(json);

        return this.mappingService.listContentItemsResponse<TElements>(fakeResponse.data, queryConfig);
    }
}
