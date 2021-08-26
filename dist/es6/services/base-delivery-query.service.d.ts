import { IBaseResponse, IHeader, IHttpService, IQueryParameter } from '@kentico/kontent-core';
import { Observable } from 'rxjs';
import { IDeliveryClientConfig } from '../config';
import { IQueryConfig, ISDKInfo } from '../models/common/common-models';
import { IMappingService } from './mapping.service';
export declare abstract class BaseDeliveryQueryService {
    /**
     * Delivery client configuration
     */
    protected readonly config: IDeliveryClientConfig;
    /**
     * Http service for fetching data
     */
    protected readonly httpService: IHttpService;
    /**
     * Information about the SDK
     */
    protected readonly sdkInfo: ISDKInfo;
    /**
     * Mapping service
     */
    protected readonly mappingService: IMappingService;
    /**
     * Header name for SDK usage
     */
    private readonly sdkVersionHeader;
    /**
     * Default base Url to Kentico Delivery API
     */
    private readonly defaultBaseDeliveryApiUrl;
    /**
     * Default preview url to Kentico Delivery API
     */
    private readonly defaultPreviewDeliveryApiUrl;
    /**
     * Name of the header used when 'wait for loading new content' feature is used
     */
    private readonly waitForLoadingNewContentHeader;
    constructor(
    /**
     * Delivery client configuration
     */
    config: IDeliveryClientConfig, 
    /**
     * Http service for fetching data
     */
    httpService: IHttpService, 
    /**
     * Information about the SDK
     */
    sdkInfo: ISDKInfo, 
    /**
     * Mapping service
     */
    mappingService: IMappingService);
    /**
    * Gets url based on the action, query configuration and options (parameters)
    * @param action Action (= url part) that will be hit
    * @param queryConfig Query configuration
    * @param options Query options
    */
    getUrl(action: string, queryConfig: IQueryConfig, options?: IQueryParameter[]): string;
    /**
    * Gets proper set of headers for given request.
    * @param queryConfig Query configuration
    * @param additionalHeaders Custom headers
    */
    getHeaders(queryConfig: IQueryConfig, additionalHeaders?: IHeader[]): IHeader[];
    /**
     * Http GET response
     * @param url Url of request
     * @param queryConfig Query config configuration
     */
    protected getResponse<TRawData>(url: string, queryConfig?: IQueryConfig, serviceConfig?: {
        headers?: IHeader[];
    }): Observable<IBaseResponse<TRawData>>;
    /**
    * Gets base URL of the request including the project Id
    * @param queryConfig Query configuration
    */
    protected getBaseUrl(queryConfig: IQueryConfig): string;
    /**
    * Indicates if current query should use preview mode
    * @param queryConfig Query configuration
    */
    private isPreviewModeEnabled;
    private getQueryHeaders;
    private shouldAddWaitForLoadingNewContentHeader;
    /**
    * Indicates if current query should use secured mode
    * @param queryConfig Query configuration
    */
    private isSecuredModeEnabled;
    /**
    * Gets preview or standard URL based on client and query configuration
    * @param queryConfig Query configuration
    */
    private getDomain;
    /**
    * Gets authorization header. This is used for 'preview' functionality
    */
    private getAuthorizationHeader;
    /**
    * Header identifying SDK type & version for internal purposes of Kentico
    */
    private getSdkIdHeader;
    private mapDeliveryError;
}
