// config
import { DeliveryClientConfig } from '../config/delivery-client.config';

// rxjs
import { Observable } from 'rxjs/Rx'; // import from 'rxjs/rx' instead of 'rxjs/Observable' to include 'throw' method
import { ajax } from 'rxjs/observable/dom/ajax';
import { AjaxResponse, AjaxError } from 'rxjs/observable/dom/AjaxObservable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/observable/throw';

// models
import { ItemResponses } from '../models/item/responses';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { IQueryParameter } from '../interfaces/common/iquery-parameter.interface';
import { TypeResponses } from '../models/type/responses';
import { IQueryConfig } from '../interfaces/common/iquery.config';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { IHeader } from '../interfaces/common/iheader.interface';
import { Header } from '../models/common/header.class';
import { CloudError } from '../models/common/cloud-error.class';
import { ICloudErrorResponse } from '../interfaces/common/icloud-error-response.interface';
import { TaxonomyResponses } from '../models/taxonomy/responses';

// services
import { ResponseMapService } from './response-map.service';

export abstract class QueryService {

    /**
    * Base Url to Kentico Delivery API
    */
    private baseDeliveryApiUrl: string = 'https://deliver.kenticocloud.com';

    /**
    * Preview url to Kentico Delivery API
    */
    private previewDeliveryApiUrl: string = 'https://preview-deliver.kenticocloud.com';

    /**
     * Service used to map responses (json) from Kentico cloud to strongly typed types
     */
    protected responseMapService: ResponseMapService;

    constructor(
        /**
         * Delivery client configuration
         */
        protected config: DeliveryClientConfig
    ) {
        this.responseMapService = new ResponseMapService(config);
    }

    /**
     * Handles given error
     * @param error Error to be handled
     */
    private handleError(error: Response | AjaxResponse): any | CloudError {
        if (this.config.enableAdvancedLogging) {
            console.error(error);
        }

        if (error instanceof AjaxError) {
            var xhrResponse = error.xhr.response as ICloudErrorResponse;
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
                }
                else {
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
    protected getUrl(action: string, queryConfig: IQueryConfig, options?: IQueryParameter[]): string {
        return this.addOptionsToUrl(this.getBaseUrl(queryConfig) + action, options);
    }

    /**
     * Gets single item from given url
     * @param url Url used to get single item
     * @param queryConfig Query configuration
     */
    protected getSingleItem<TItem extends IContentItem>(url: string, queryConfig: IItemQueryConfig): Observable<ItemResponses.DeliveryItemResponse<TItem>> {
        return ajax.getJSON(url, this.getHeadersJson(queryConfig))
            .map(json => {
                return this.responseMapService.mapSingleResponse<TItem>(json, queryConfig)
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
    protected getMultipleItems<TItem extends IContentItem>(url: string, queryConfig: IItemQueryConfig): Observable<ItemResponses.DeliveryItemListingResponse<TItem>> {
        return ajax.getJSON(url, this.getHeadersJson(queryConfig))
            .map(json => {
                return this.responseMapService.mapMultipleResponse(json, queryConfig)
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
    protected getSingleType(url: string, queryConfig: IQueryConfig): Observable<TypeResponses.DeliveryTypeResponse> {
        return ajax.getJSON(url, this.getHeadersJson(queryConfig))
            .map(json => {
                return this.responseMapService.mapSingleTypeResponse(json)
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
    protected getMultipleTypes(url: string, queryConfig: IQueryConfig): Observable<TypeResponses.DeliveryTypeListingResponse> {
        return ajax.getJSON(url, this.getHeadersJson(queryConfig))
            .map(json => {
                return this.responseMapService.mapMultipleTypeResponse(json)
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
    protected getTaxonomy(url: string, queryConfig: IQueryConfig): Observable<TaxonomyResponses.TaxonomyResponse> {
        return ajax.getJSON(url, this.getHeadersJson(queryConfig))
            .map(json => {
                return this.responseMapService.mapTaxonomyResponse(json)
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
    protected getTaxonomies(url: string, queryConfig: IQueryConfig): Observable<TaxonomyResponses.TaxonomiesResponse> {
        return ajax.getJSON(url, this.getHeadersJson(queryConfig))
            .map(json => {
                return this.responseMapService.mapTaxonomiesResponse(json)
            })
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
    protected getHeadersInternal(queryConfig: IQueryConfig): IHeader[] {
        var headers: IHeader[] = [];
        if (this.isPreviewModeEnabled(queryConfig)) {
            headers.push(this.getAuthorizationHeader());
        }

        return headers;
    }

    /**
     * Gets the json representation of headers
     * @param queryConfig Query configuration
     */
    private getHeadersJson(queryConfig: IQueryConfig): any {
        var headerJson: any = {};

        var headers = this.getHeadersInternal(queryConfig);

        headers.forEach(header => {
            headerJson[header.header] = header.value;
        });

        return headerJson;
    }
}