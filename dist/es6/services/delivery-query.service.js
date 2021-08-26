import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BaseDeliveryQueryService } from './base-delivery-query.service';
export class QueryService extends BaseDeliveryQueryService {
    constructor(config, httpService, sdkInfo, mappingService) {
        super(config, httpService, sdkInfo, mappingService);
        this.ContinuationHeaderName = 'X-Continuation';
    }
    /**
     * Gets single item from given url
     * @param url Url used to get single item
     * @param queryConfig Query configuration
     */
    getSingleItem(url, queryConfig) {
        return this.getResponse(url, queryConfig).pipe(map((response) => {
            return this.mappingService.viewContentItemResponse(response, queryConfig);
        }));
    }
    /**
     * Gets single feed response. Might not contain all items in your project.
     * @param url Url
     * @param queryConfig Query configuration
     */
    getItemsFeed(url, queryConfig) {
        return this.getResponse(url).pipe(map((response) => {
            return this.mappingService.itemsFeedResponse(response, queryConfig);
        }));
    }
    /**
     * Gets all items from feed. This method may execute multiple HTTP requests.
     * @param url Url
     * @param queryConfig Query configuration
     */
    getItemsFeedAll(url, queryConfig) {
        const responses = [];
        return this.getAllItemsFeedResponses(url, {}, responses).pipe(map(() => {
            return this.mappingService.itemsFeedAllResponse(responses, queryConfig);
        }));
    }
    /**
     * Gets multiple items from given url
     * @param url Url used to get multiple items
     * @param queryConfig Query configuration
     */
    getMultipleItems(url, queryConfig) {
        return this.getResponse(url, queryConfig).pipe(map((response) => {
            return this.mappingService.listContentItemsResponse(response, queryConfig);
        }));
    }
    /**
     * Gets single content type from given url
     * @param url Url used to get single type
     * @param queryConfig Query configuration
     */
    getSingleType(url, queryConfig) {
        return this.getResponse(url, queryConfig).pipe(map((response) => {
            return this.mappingService.viewContentTypeResponse(response);
        }));
    }
    /**
     * Gets multiple content types from given url
     * @param url Url used to get multiple types
     * @param queryConfig Query configuration
     */
    getMultipleTypes(url, queryConfig) {
        return this.getResponse(url, queryConfig).pipe(map((response) => {
            return this.mappingService.listContentTypesResponse(response);
        }));
    }
    /**
     * Gets languages
     * @param url Url
     * @param queryConfig Query configuration
     */
    getLanguages(url, queryConfig) {
        return this.getResponse(url, queryConfig).pipe(map((response) => {
            return this.mappingService.listLanguagesResponse(response);
        }));
    }
    /**
     * Gets single taxonomy from given url
     * @param url Url used to get single taxonomy
     * @param queryConfig Query configuration
     */
    getTaxonomy(url, queryConfig) {
        return this.getResponse(url, queryConfig).pipe(map((response) => {
            return this.mappingService.viewTaxonomyGroupResponse(response);
        }));
    }
    /**
     * Gets multiple taxonomies from given url
     * @param url Url used to get multiple taxonomies
     * @param queryConfig Query configuration
     */
    getTaxonomies(url, queryConfig) {
        return this.getResponse(url, queryConfig).pipe(map((response) => {
            return this.mappingService.listTaxonomyGroupsResponse(response);
        }));
    }
    /**
     * Gets single content type element from given url
     * @param url Url used to get single content type element
     * @param queryConfig Query configuration
     */
    getElement(url, queryConfig) {
        return this.getResponse(url, queryConfig).pipe(map((response) => {
            return this.mappingService.viewContentTypeElementResponse(response);
        }));
    }
    getAllItemsFeedResponses(url, queryConfig, responses, continuationToken) {
        const headers = [];
        if (continuationToken) {
            headers.push({
                header: this.ContinuationHeaderName,
                value: continuationToken
            });
        }
        return this.getResponse(url, queryConfig, {
            headers: headers
        }).pipe(switchMap((response) => {
            responses.push(response);
            const continuationHeader = response.headers.find((m) => m.header.toLowerCase() === this.ContinuationHeaderName.toLowerCase());
            if (continuationHeader) {
                return this.getAllItemsFeedResponses(url, queryConfig, responses, continuationHeader.value);
            }
            return of(undefined);
        }));
    }
}
//# sourceMappingURL=delivery-query.service.js.map