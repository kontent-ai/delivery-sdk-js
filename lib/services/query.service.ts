import { Observable, throwError } from 'rxjs';
import { catchError, map, retryWhen } from 'rxjs/operators';

import { DeliveryClientConfig } from '../config/delivery-client.config';
import { ICloudErrorResponse } from '../interfaces/common/icloud-error-response.interface';
import { IHeader } from '../interfaces/common/iheader.interface';
import { IQueryParameter } from '../interfaces/common/iquery-parameter.interface';
import { IQueryConfig } from '../interfaces/common/iquery.config';
import { ISdkInfo } from '../interfaces/common/isdk-info.class';
import { IContentItem } from '../interfaces/item/icontent-item.interface';
import { IItemQueryConfig } from '../interfaces/item/iitem-query.config';
import { ITaxonomyQueryConfig } from '../interfaces/taxonomy/itaxonomy-query.config';
import { IContentTypeQueryConfig } from '../interfaces/type/icontent-type-query.config';
import { Header } from '../models/common/header.class';
import { ElementResponses } from '../models/element/responses';
import { ItemResponses } from '../models/item/responses';
import { TaxonomyResponses } from '../models/taxonomy/responses';
import { TypeResponses } from '../models/type/responses';
import { IRichTextHtmlParser } from '../parser';
import { IBaseResponse, IBaseCloudError } from '../services/http/models';
import { IHttpService } from './http/ihttp.service';
import { ResponseMapService } from './response-map.service';
import { retryStrategy } from './retry/retry-strategy';


export class QueryService {

    /**
     * Default number of retry attempts when user did not set any
     */
    private readonly defaultRetryAttempts: number = 0;

    /**
     * Excluded status code from retry functionality
     */
    private readonly retryExcludedStatuses: number[] = [404, 401];

    /**
     * Header name for SDK usage
     */
    private readonly sdkVersionHeader: string = 'X-KC-SDKID';

    /**
    * Default base Url to Kentico Delivery API
    */
    private readonly defaultBaseDeliveryApiUrl: string = 'https://deliver.kenticocloud.com';

    /**
    * Default preview url to Kentico Delivery API
    */
    private readonly defaultPreviewDeliveryApiUrl: string = 'https://preview-deliver.kenticocloud.com';

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
        protected httpService: IHttpService,
        /**
         * Information about the SDK
         * This can contain information from both this & Node SDK for internal logging with 'SDKID' header
         */
        protected sdkInfo: ISdkInfo,
        /**
         * Used for manipulating with rich text HTML (required for Node / Browser support)
         */
        private readonly richTextHtmlParser: IRichTextHtmlParser
    ) {
        if (!config) {
            throw Error(`Invalid configuration has been provided`);
        }
        this.responseMapService = new ResponseMapService(config, richTextHtmlParser);
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
            .pipe(
                map(response => {
                    return this.responseMapService.mapSingleResponse<TItem>(response, queryConfig)
                }),
                catchError(err => {
                    return throwError(this.handleError(err));
                })
            );
    }

    /**
    * Gets multiple items from given url
    * @param url Url used to get multiple items
    * @param queryConfig Query configuration
    */
    getMultipleItems<TItem extends IContentItem>(url: string, queryConfig: IItemQueryConfig): Observable<ItemResponses.DeliveryItemListingResponse<TItem>> {
        return this.getResponse(url, queryConfig)
            .pipe(
                map(response => {
                    return this.responseMapService.mapMultipleResponse<TItem>(response, queryConfig)
                }),
                catchError(err => {
                    return throwError(this.handleError(err));
                })
            );
    }

    /**
     * Gets single content type from given url
     * @param url Url used to get single type
     * @param queryConfig Query configuration
     */
    getSingleType(url: string, queryConfig: IContentTypeQueryConfig): Observable<TypeResponses.DeliveryTypeResponse> {
        return this.getResponse(url, queryConfig)
            .pipe(
                map(response => {
                    return this.responseMapService.mapSingleTypeResponse(response)
                }),
                catchError(err => {
                    return throwError(this.handleError(err));
                })
            );
    }

    /**
     * Gets multiple content types from given url
     * @param url Url used to get multiple types
     * @param queryConfig Query configuration
     */
    getMultipleTypes(url: string, queryConfig: IContentTypeQueryConfig): Observable<TypeResponses.DeliveryTypeListingResponse> {
        return this.getResponse(url, queryConfig)
            .pipe(
                map(response => {
                    return this.responseMapService.mapMultipleTypeResponse(response)
                }),
                catchError(err => {
                    return throwError(this.handleError(err));
                })
            );
    }

    /**
     * Gets single taxonomy from given url
     * @param url Url used to get single taxonomy
     * @param queryConfig Query configuration
     */
    getTaxonomy(url: string, queryConfig: ITaxonomyQueryConfig): Observable<TaxonomyResponses.TaxonomyResponse> {
        return this.getResponse(url, queryConfig)
            .pipe(
                map(response => {
                    return this.responseMapService.mapTaxonomyResponse(response)
                }),
                catchError(err => {
                    return throwError(this.handleError(err));
                })
            );
    }

    /**
    * Gets multiple taxonomies from given url
    * @param url Url used to get multiple taxonomies
    * @param queryConfig Query configuration
    */
    getTaxonomies(url: string, queryConfig: ITaxonomyQueryConfig): Observable<TaxonomyResponses.TaxonomiesResponse> {
        return this.getResponse(url, queryConfig)
            .pipe(
                map(response => {
                    return this.responseMapService.mapTaxonomiesResponse(response)
                }),
                catchError(err => {
                    return throwError(this.handleError(err));
                })
            );
    }

    /**
    * Gets single content type element from given url
    * @param url Url used to get single content type element
    * @param queryConfig Query configuration
    */
    getElement(url: string, queryConfig: ITaxonomyQueryConfig): Observable<ElementResponses.ElementResponse> {
        return this.getResponse(url, queryConfig)
            .pipe(
                map(response => {
                    return this.responseMapService.mapElementResponse(response)
                }),
                catchError(err => {
                    return throwError(this.handleError(err));
                })
            );
    }

    /**
     * Gets proper set of headers for given request.
     * @param queryConfig Query configuration
     */
    getHeaders(queryConfig: IQueryConfig): IHeader[] {
        const headers: IHeader[] = [];

        // add SDK Id header for monitoring SDK usage
        headers.push(this.getSdkIdHeader());

        if (this.isPreviewModeEnabled(queryConfig) && this.isSecuredModeEnabled(queryConfig)) {
            throw Error(`Preview & secured mode cannot be used at the same time.`);
        }

        // add preview header is required
        if (this.isPreviewModeEnabled(queryConfig)) {
            headers.push(this.getAuthorizationHeader(this.config.previewApiKey));
        }

        // add secured mode header is required
        if (this.isSecuredModeEnabled(queryConfig)) {
            headers.push(this.getAuthorizationHeader(this.config.securedApiKey));
        }

        // add 'X-KC-Wait-For-Loading-New-Content' header if required
        if (queryConfig.waitForLoadingNewContent) {
            headers.push(new Header(this.waitForLoadingNewContentHeader, 'true'));
        }

        return headers;
    }


    /**
     * Handles given error
     * @param error Error to be handled
     */
    private handleError(error: IBaseCloudError | any): any | ICloudErrorResponse {
        if (this.config.enableAdvancedLogging) {
            console.error(error);
        }

        console.warn('error here:');
        console.warn(error);

        if (error.request_id) {
            return <ICloudErrorResponse>{
                message: error.kenticoCloudError.message,
                request_id: error.kenticoCloudError.request_id,
                error_code: error.kenticoCloudError.error_code,
                specific_code: error.kenticoCloudError.specific_code, error
            };
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
    * Indicates if current query should use secured mode
    * @param queryConfig Query configuration
    */
    private isSecuredModeEnabled(queryConfig: IQueryConfig): boolean {
        if (queryConfig.useSecuredMode != null) {
            return queryConfig.useSecuredMode;
        }

        return this.config.enableSecuredMode === true;
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

            // use custom base / preview url if its configured
            if (this.config.basePreviewUrl) {
                return this.config.basePreviewUrl;
            }

            // use default preview url
            return this.defaultPreviewDeliveryApiUrl;
        }

        // use custom base / preview url if its configured
        if (this.config.baseUrl) {
            return this.config.baseUrl;
        }
        return this.defaultBaseDeliveryApiUrl;
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
                    url = url + '&' + filter.getParam() + '=' + filter.getParamValue();
                } else {
                    url = url + '?' + filter.getParam() + '=' + filter.getParamValue();
                }
            });
        }
        return url;
    }

    /**
     * Http get response
     * @param url Url of request
     * @param queryConfig Query configuration
     */
    protected getResponse(url: string, queryConfig: IQueryConfig): Observable<IBaseResponse> {
        // hold the attempt count
        const attempt = 1;

        return this.httpService.get(url, this.getHeaders(queryConfig))
            .pipe(
                map((response: IBaseResponse) => {
                    return response;
                }),
                retryWhen(retryStrategy.strategy({
                    maxRetryAttempts: this.config.retryAttempts ? this.config.retryAttempts : this.defaultRetryAttempts,
                    excludedStatusCodes: this.retryExcludedStatuses
                })),
                catchError(err => {
                    return throwError(this.handleError(err));
                })
            );
    }

    /**
     * Gets authorization header. This is used for 'preview' functionality
     */
    private getAuthorizationHeader(key?: string): IHeader {
        if (!key) {
            throw Error(`Cannot get authorization header because key is undefined`);
        }
        // authorization header required for preview mode
        return new Header('authorization', `bearer ${key}`);
    }

    /**
     * Header identifying SDK type & version for internal purposes of Kentico
     */
    private getSdkIdHeader(): IHeader {
        return new Header(this.sdkVersionHeader, `${this.sdkInfo.host};${this.sdkInfo.name};${this.sdkInfo.version}`);
    }

}
