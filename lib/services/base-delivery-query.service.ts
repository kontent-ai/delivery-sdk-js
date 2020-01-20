import {
    BaseKontentError,
    IBaseResponse,
    IBaseResponseError,
    IHeader,
    IHttpService,
    IQueryParameter,
    mapBaseKontentError,
    urlHelper,
} from '@kentico/kontent-core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IDeliveryClientConfig } from '../config';
import { IQueryConfig, ISDKInfo } from '../models/common/common-models';
import { IMappingService } from './mapping.service';

export abstract class BaseDeliveryQueryService {

    /**
     * Header name for SDK usage
     */
    private readonly sdkVersionHeader: string = 'X-KC-SDKID';

    /**
     * Default base Url to Kentico Delivery API
     */
    private readonly defaultBaseDeliveryApiUrl: string =
        'https://deliver.kontent.ai';

    /**
     * Default preview url to Kentico Delivery API
     */
    private readonly defaultPreviewDeliveryApiUrl: string =
        'https://preview-deliver.kontent.ai';

    /**
     * Name of the header used when 'wait for loading new content' feature is used
     */
    private readonly waitForLoadingNewContentHeader: string =
        'X-KC-Wait-For-Loading-New-Content';

    constructor(
        /**
         * Delivery client configuration
         */
        protected readonly config: IDeliveryClientConfig,
        /**
         * Http service for fetching data
         */
        protected readonly httpService: IHttpService,
        /**
         * Information about the SDK
         */
        protected readonly sdkInfo: ISDKInfo,
        /**
         * Mapping service
         */
        protected readonly mappingService: IMappingService
    ) {
    }

    /**
    * Gets url based on the action, query configuration and options (parameters)
    * @param action Action (= url part) that will be hit
    * @param queryConfig Query configuration
    * @param options Query options
    */
    getUrl(
        action: string,
        queryConfig: IQueryConfig,
        options?: IQueryParameter[]
    ): string {
        if (!this.config.proxy || !this.config.proxy.advancedProxyUrlResolver) {
            return urlHelper.addOptionsToUrl(this.getBaseUrl(queryConfig) + action, options);
        }
        return this.config.proxy.advancedProxyUrlResolver({
            queryParameters: options ? options : [],
            queryString: urlHelper.addOptionsToUrl('', options),
            action: action,
            domain: this.getDomain(queryConfig),
            queryConfig: queryConfig,
            projectId: this.config.projectId
        });
    }

    /**
    * Gets proper set of headers for given request.
    * @param queryConfig Query configuration
    * @param additionalHeaders Custom headers
    */
    getHeaders(queryConfig: IQueryConfig, additionalHeaders?: IHeader[]): IHeader[] {
        const headers: IHeader[] = [];

        if (additionalHeaders) {
            headers.push(...additionalHeaders);
        }

        // add SDK Id header for monitoring SDK usage
        headers.push(this.getSdkIdHeader());

        // add headers from global config
        if (this.config.globalHeaders) {
            headers.push(...this.config.globalHeaders(queryConfig));
        }

        // add query / global headers from query config
        headers.push(...this.getQueryHeaders(queryConfig));

        if (
            this.isPreviewModeEnabled(queryConfig) &&
            this.isSecuredModeEnabled(queryConfig)
        ) {
            throw Error(`Preview & secured modes cannot be used at the same time.`);
        }

        // add preview header is required
        if (this.isPreviewModeEnabled(queryConfig) && this.config.previewApiKey) {
            headers.push(this.getAuthorizationHeader(this.config.previewApiKey));
        }

        // add secured mode header is required
        if (this.isSecuredModeEnabled(queryConfig) && this.config.secureApiKey) {
            headers.push(this.getAuthorizationHeader(this.config.secureApiKey));
        }

        // add 'X-KC-Wait-For-Loading-New-Content' header if required
        if (this.shouldAddWaitForLoadingNewContentHeader(queryConfig)) {
            headers.push({
                header: this.waitForLoadingNewContentHeader,
                value: 'true'
            });
        }

        return headers;
    }

    /**
     * Http GET response
     * @param url Url of request
     * @param queryConfig Query config configuration
     */
    protected getResponse<TRawData>(
        url: string,
        queryConfig?: IQueryConfig,
        serviceConfig?: {
            headers?: IHeader[]
        }
    ): Observable<IBaseResponse<TRawData>> {
        if (!queryConfig) {
            queryConfig = {};
        }

        if (!serviceConfig) {
            serviceConfig = {};
        }

        return this.httpService
            .get<BaseKontentError, TRawData>(
                {
                    url: url,
                    mapError: error => mapBaseKontentError(error)
                },
                {
                    retryStrategy: this.config.retryStrategy,
                    headers: this.getHeaders(queryConfig, serviceConfig.headers ? serviceConfig.headers : []),
                    logErrorToConsole: this.config.isDeveloperMode
                }
            )
            .pipe(
                catchError((error: IBaseResponseError<BaseKontentError>) => {
                    return throwError(error.mappedError);
                })
            );
    }

    /**
    * Gets base URL of the request including the project Id
    * @param queryConfig Query configuration
    */
    protected getBaseUrl(queryConfig: IQueryConfig): string {
        return this.getDomain(queryConfig) + '/' + this.config.projectId;
    }

    /**
    * Indicates if current query should use preview mode
    * @param queryConfig Query configuration
    */
    private isPreviewModeEnabled(queryConfig: IQueryConfig): boolean {
        if (queryConfig.usePreviewMode !== undefined) {
            return queryConfig.usePreviewMode;
        }

        if (!this.config.globalQueryConfig) {
            return false;
        }

        if (this.config.globalQueryConfig.usePreviewMode === true) {
            return true;
        }

        return false;
    }

    private getQueryHeaders(queryConfig: IQueryConfig): IHeader[] {
        if (queryConfig.customHeaders) {
            return queryConfig.customHeaders;
        }

        if (!this.config.globalQueryConfig || !this.config.globalQueryConfig.customHeaders) {
            return [];
        }
        return this.config.globalQueryConfig.customHeaders;
    }

    private shouldAddWaitForLoadingNewContentHeader(queryConfig: IQueryConfig): boolean {
        if (queryConfig.waitForLoadingNewContent !== undefined) {
            return queryConfig.waitForLoadingNewContent;
        }

        if (!this.config.globalQueryConfig) {
            return false;
        }

        if (this.config.globalQueryConfig.waitForLoadingNewContent === true) {
            return true;
        }

        return false;
    }

    /**
    * Indicates if current query should use secured mode
    * @param queryConfig Query configuration
    */
    private isSecuredModeEnabled(queryConfig: IQueryConfig): boolean {
        if (queryConfig.useSecuredMode !== undefined) {
            return queryConfig.useSecuredMode;
        }

        if (!this.config.globalQueryConfig) {
            return false;
        }

        if (this.config.globalQueryConfig.useSecuredMode === true) {
            return true;
        }

        return false;
    }

    /**
    * Gets preview or standard URL based on client and query configuration
    * @param queryConfig Query configuration
    */
    private getDomain(queryConfig: IQueryConfig): string {
        if (this.isPreviewModeEnabled(queryConfig)) {
            if (!this.config.previewApiKey) {
                throw Error(
                    `Preview API key is not configured.`
                );
            }

            // check custom preview url
            if (this.config.proxy && this.config.proxy.basePreviewUrl) {
                return this.config.proxy.basePreviewUrl;
            }

            // use default preview url
            return this.defaultPreviewDeliveryApiUrl;
        }

        // check custom base url
        if (this.config.proxy && this.config.proxy.baseUrl) {
            return this.config.proxy.baseUrl;
        }
        return this.defaultBaseDeliveryApiUrl;
    }

    /**
    * Gets authorization header. This is used for 'preview' functionality
    */
    private getAuthorizationHeader(key?: string): IHeader {
        if (!key) {
            throw Error(`Cannot get authorization header because key is invalid`);
        }
        // authorization header required for preview mode
        return {
            header: 'authorization',
            value: `bearer ${key}`
        };
    }

    /**
    * Header identifying SDK type & version for internal purposes of Kentico
    */
    private getSdkIdHeader(): IHeader {
        return {
            header: this.sdkVersionHeader,
            value: `${this.sdkInfo.host};${this.sdkInfo.name};${this.sdkInfo.version}`
        };
    }

}
