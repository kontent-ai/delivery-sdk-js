// config
import { DeliveryClientConfig } from '../config/delivery-client.config';

// rxjs
import { Observable } from 'rxjs/Rx'; // import from 'rxjs/rx' instead of 'rxjs/Observable' to include 'throw' method
import { ajax } from 'rxjs/observable/dom/ajax';
import { AjaxError } from 'rxjs/observable/dom/AjaxObservable';

// models
import { ItemResponses } from '../models/item/responses';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { IQueryParameter } from '../interfaces/common/iquery-parameter.interface';
import { TypeResponses } from '../models/type/responses';
import { IHeader } from '../interfaces/common/iheader.interface';
import { Header } from '../models/common/header.class';
import { CloudError } from '../models/common/cloud-error.class';
import { ICloudErrorResponse } from '../interfaces/common/icloud-error-response.interface';
import { TaxonomyResponses } from '../models/taxonomy/responses';
import { ElementResponses } from '../models/element/responses';
import { BaseResponse } from '../services/http/base-response.class';

// query configs
import { IQueryConfig } from '../interfaces/common/iquery.config';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { IContentTypeQueryConfig } from '../interfaces/type/icontent-type-query.config';
import { ITaxonomyQueryConfig } from '../interfaces/taxonomy/itaxonomy-query.config';
import { IElementQueryConfig } from '../interfaces/element/ielement-query.config';

// services
import { ResponseMapService } from './response-map.service';
import { IHttpService } from './http/ihttp.service';

export class QueryService {

    /**
    * Base Url to Kentico Delivery API
    */
    private readonly baseDeliveryApiUrl: string = 'https://deliver.kenticocloud.com';

    /**
    * Preview url to Kentico Delivery API
    */
    private readonly previewDeliveryApiUrl: string = 'https://preview-deliver.kenticocloud.com';

    /**
     * Name of the header used when 'wait for loading new content' feature is used
     */
    private readonly waitForLoadingNewContentHeader: string = 'X-KC-Wait-For-Loading-New-Content';

    /**
     * Service used to map responses (json) from Kentico cloud to strongly typed types
     */
    protected responseMapService: ResponseMapService;

    constructor(
        /**
         * Delivery client configuration
         */
        protected config: DeliveryClientConfig,
        /**
         * Http service for fetching data
         */
        protected httpService: IHttpService
    ) {
        if (!config) {
            throw Error(`Invalid configuration has been provided`);
        }
        this.responseMapService = new ResponseMapService(config);
    }

    /**
     * Handles given error
     * @param error Error to be handled
     */
    private handleError(error: Response | AjaxError): any | CloudError {
        if (this.config.enableAdvancedLogging) {
            console.error(error);
        }

        if (error instanceof AjaxError) {
            const xhrResponse = error.xhr.response as ICloudErrorResponse;
            if (!xhrResponse) {
                return error;
            }
            // return Cloud specific error
            return new CloudError(xhrResponse.message, xhrResponse.request_id, xhrResponse.error_code, xhrResponse.specific_code, error);
        }

        return error;
    }

    /**
     * Indicates if current query should use preview mode
     * @param queryConfig Query configuration
     */
    private isPreviewModeEnabled(queryConfig: IQueryConfig): boolean {
        if (queryConfig.usePreviewMode != null) {
            return queryConfig.usePreviewMode;
        }

        return this.config.enablePreviewMode === true;
    }

    /**
     * Gets preview or standard URL based on client and query configuration
     * @param queryConfig Query configuration
     */
    private getDeliveryUrl(queryConfig: IQueryConfig): string {
        if (this.isPreviewModeEnabled(queryConfig)) {

            if (!this.config.previewApiKey) {
                throw Error(`You have to configure 'previewApiKey' to use 'preview' mode`);
            }

            return this.previewDeliveryApiUrl;
        }
        return this.baseDeliveryApiUrl;
    }

    /**
     * Gets base URL of the request including the project Id
     * @param queryConfig Query configuration
     */
    private getBaseUrl(queryConfig: IQueryConfig): string {
        return this.getDeliveryUrl(queryConfig) + '/' + this.config.projectId;
    }

    /**
     * Adds query parameters to given url
     * @param url Url to which options will be added
     * @param options Query parameters to add
     */
    private addOptionsToUrl(url: string, options?: IQueryParameter[]): string {
        if (options) {
            options.forEach(filter => {
                if (url.indexOf('?') > -1) {
                    url = url + '&' + filter.GetParam() + '=' + filter.GetParamValue();
                } else {
                    url = url + '?' + filter.GetParam() + '=' + filter.GetParamValue();
                }
            });
        }
        return url;
    }

    /**
     * Gets url based on the action, query configuration and options (parameters)
     * @param action Action (= url part) that will be hit
     * @param queryConfig Query configuration
     * @param options Query options
     */
    getUrl(action: string, queryConfig: IQueryConfig, options?: IQueryParameter[]): string {
        return this.addOptionsToUrl(this.getBaseUrl(queryConfig) + action, options);
    }

    /**
     * Gets single item from given url
     * @param url Url used to get single item
     * @param queryConfig Query configuration
     */
    getSingleItem<TItem extends IContentItem>(url: string, queryConfig: IItemQueryConfig): Observable<ItemResponses.DeliveryItemResponse<TItem>> {
        return this.getResponse(url, queryConfig)
            .map(response => {
                return this.responseMapService.mapSingleResponse<TItem>(response, queryConfig)
            })
            .catch(err => {
                return Observable.throw(this.handleError(err));
            });
    }

    /**
    * Gets multiple items from given url
    * @param url Url used to get multiple items
    * @param queryConfig Query configuration
    */
    getMultipleItems<TItem extends IContentItem>(url: string, queryConfig: IItemQueryConfig): Observable<ItemResponses.DeliveryItemListingResponse<TItem>> {
        return this.getResponse(url, queryConfig)
            .map(response => {
                return this.responseMapService.mapMultipleResponse(response, queryConfig)
            })
            .catch(err => {
                return Observable.throw(this.handleError(err));
            });
    }

    /**
     * Gets single content type from given url
     * @param url Url used to get single type
     * @param queryConfig Query configuration
     */
    getSingleType(url: string, queryConfig: IContentTypeQueryConfig): Observable<TypeResponses.DeliveryTypeResponse> {
        return this.getResponse(url, queryConfig)
            .map(response => {
                return this.responseMapService.mapSingleTypeResponse(response)
            })
            .catch(err => {
                return Observable.throw(this.handleError(err));
            });
    }

    /**
     * Gets multiple content types from given url
     * @param url Url used to get multiple types
     * @param queryConfig Query configuration
     */
    getMultipleTypes(url: string, queryConfig: IContentTypeQueryConfig): Observable<TypeResponses.DeliveryTypeListingResponse> {
        return this.getResponse(url, queryConfig)
            .map(response => {
                return this.responseMapService.mapMultipleTypeResponse(response)
            })
            .catch(err => {
                return Observable.throw(this.handleError(err));
            });
    }

    /**
     * Gets single taxonomy from given url
     * @param url Url used to get single taxonomy
     * @param queryConfig Query configuration
     */
    getTaxonomy(url: string, queryConfig: ITaxonomyQueryConfig): Observable<TaxonomyResponses.TaxonomyResponse> {
        return this.getResponse(url, queryConfig)
            .map(response => {
                return this.responseMapService.mapTaxonomyResponse(response)
            })
            .catch(err => {
                return Observable.throw(this.handleError(err));
            });
    }

    /**
    * Gets multiple taxonomies from given url
    * @param url Url used to get multiple taxonomies
    * @param queryConfig Query configuration
    */
    getTaxonomies(url: string, queryConfig: ITaxonomyQueryConfig): Observable<TaxonomyResponses.TaxonomiesResponse> {
        return this.getResponse(url, queryConfig)
            .map(response => {
                return this.responseMapService.mapTaxonomiesResponse(response)
            })
            .catch(err => {
                return Observable.throw(this.handleError(err));
            });
    }

    /**
    * Gets single content type element from given url
    * @param url Url used to get single content type element
    * @param queryConfig Query configuration
    */
    getElement(url: string, queryConfig: ITaxonomyQueryConfig): Observable<ElementResponses.ElementResponse> {
        return this.getResponse(url, queryConfig)
            .map(response => {
                return this.responseMapService.mapElementResponse(response)
            })
            .catch(err => {
                return Observable.throw(this.handleError(err));
            });
    }

    /**
     * Http get response
     * @param url Url of request
     * @param queryConfig Query configuration
     */
    protected getResponse(url: string, queryConfig: IQueryConfig): Observable<BaseResponse> {
        return this.httpService.get(url, this.getHeaders(queryConfig))
            .map((response: BaseResponse) => response)
            .catch(err => {
                return Observable.throw(this.handleError(err));
            });
    }

    /**
     * Gets authorization header. This is used for 'preview' functionality
     */
    private getAuthorizationHeader(): IHeader {
        if (!this.config.previewApiKey) {
            throw Error(`Cannot get authorization header because 'previewApiKey' is not defined`);
        }
        // authorization header required for preview mode
        return new Header('authorization', `bearer ${this.config.previewApiKey}`);
    }

    /**
     * Gets proper set of headers. For example, if the preview mode is enabled, this
     * should return the authorization header
     * @param queryConfig Query configuration
     */
    getHeaders(queryConfig: IQueryConfig): IHeader[] {
        const headers: IHeader[] = [];

        // add preview header is required
        if (this.isPreviewModeEnabled(queryConfig)) {
            headers.push(this.getAuthorizationHeader());
        }

        // add 'X-KC-Wait-For-Loading-New-Content' header if required
        if (queryConfig.waitForLoadingNewContent) {
            headers.push(new Header(this.waitForLoadingNewContentHeader, 'true'));
        }

        return headers;
    }
}
