import { IResponse, IHeader, IHttpService, IQueryParameter, urlHelper } from '@kontent-ai/core-sdk';
import { AxiosError } from 'axios';
import {
    waitForLoadingNewContentHeader,
    IQueryConfig,
    ISDKInfo,
    IDeliveryErrorRaw,
    DeliveryError,
    sdkVersionHeader,
    staleContentHeaderName,
    continuationTokenHeaderName,
    IDeliveryNetworkResponse
} from '../models';

import { IDeliveryClientConfig } from '../config';
import { IMappingService } from './mapping.service';

export abstract class BaseDeliveryQueryService {
    /**
     * Default base Url to Kontent.ai Delivery API
     */
    private readonly defaultBaseDeliveryApiUrl: string = 'https://deliver.kontent.ai';

    /**
     * Default preview url to Kontent.ai Delivery API
     */
    private readonly defaultPreviewDeliveryApiUrl: string = 'https://preview-deliver.kontent.ai';

    constructor(
        /**
         * Delivery client configuration
         */
        public readonly config: IDeliveryClientConfig,
        /**
         * Http service for fetching data
         */
        public readonly httpService: IHttpService<any>,
        /**
         * Information about the SDK
         */
        public readonly sdkInfo: ISDKInfo,
        /**
         * Mapping service
         */
        public readonly mappingService: IMappingService
    ) {}

    /**
     * Gets url based on the action, query configuration and options (parameters)
     * @param action Action (= url part) that will be hit
     * @param queryConfig Query configuration
     * @param options Query options
     */
    getUrl(action: string, queryConfig: IQueryConfig, options?: IQueryParameter[]): string {
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

        if (this.isPreviewModeEnabled(queryConfig) && this.isSecuredModeEnabled(queryConfig)) {
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
                header: waitForLoadingNewContentHeader,
                value: 'true'
            });
        }

        return headers;
    }

    /**
     * Http POST response
     * @param url Url of request
     * @param queryConfig Query config configuration
     */
    protected async postResponseAsync<TRawData>(
        url: string,
        body: any,
        queryConfig?: IQueryConfig,
        serviceConfig?: {
            headers?: IHeader[];
        }
    ): Promise<IResponse<TRawData>> {
        if (!queryConfig) {
            queryConfig = {};
        }

        if (!serviceConfig) {
            serviceConfig = {};
        }

        try {
            return await this.httpService.postAsync<TRawData>(
                {
                    url: url,
                    body: body
                },
                {
                    cancelToken: queryConfig?.cancelToken,
                    responseType: 'json',
                    retryStrategy: this.config.retryStrategy,
                    headers: this.getHeaders(queryConfig, serviceConfig.headers ? serviceConfig.headers : [])
                }
            );
        } catch (error) {
            throw this.mapDeliveryError(error);
        }
    }

    /**
     * Http GET response
     * @param url Url of request
     * @param queryConfig Query config configuration
     */
    protected async getResponseAsync<TRawData>(
        url: string,
        queryConfig?: IQueryConfig,
        serviceConfig?: {
            headers?: IHeader[];
        }
    ): Promise<IResponse<TRawData>> {
        if (!queryConfig) {
            queryConfig = {};
        }

        if (!serviceConfig) {
            serviceConfig = {};
        }

        try {
            return await this.httpService.getAsync<TRawData>(
                {
                    url: url
                },
                {
                    cancelToken: queryConfig?.cancelToken,
                    responseType: 'json',
                    retryStrategy: this.config.retryStrategy,
                    headers: this.getHeaders(queryConfig, serviceConfig.headers ? serviceConfig.headers : [])
                }
            );
        } catch (error) {
            throw this.mapDeliveryError(error);
        }
    }

    /**
     * Gets base URL of the request including the project Id
     * @param queryConfig Query configuration
     */
    protected getBaseUrl(queryConfig: IQueryConfig): string {
        return this.getDomain(queryConfig) + '/' + this.config.projectId;
    }

    protected mapNetworkResponse<TData, TContract>(
        data: TData,
        response: IResponse<any>
    ): IDeliveryNetworkResponse<TData, TContract> {
        return {
            data: data,
            response: response,
            hasStaleContent: this.getHasStaleContent(response.headers),
            xContinuationToken: this.getContinuationToken(response.headers)
        };
    }

    /**
     * Indicates if current query should use preview mode
     * @param queryConfig Query configuration
     */
    private isPreviewModeEnabled(queryConfig: IQueryConfig): boolean {
        if (queryConfig.usePreviewMode !== undefined) {
            return queryConfig.usePreviewMode;
        }

        if (!this.config.defaultQueryConfig) {
            return false;
        }

        if (this.config.defaultQueryConfig.usePreviewMode === true) {
            return true;
        }

        return false;
    }

    private getQueryHeaders(queryConfig: IQueryConfig): IHeader[] {
        if (queryConfig.customHeaders) {
            return queryConfig.customHeaders;
        }

        if (this.config.defaultQueryConfig?.customHeaders) {
            return this.config.defaultQueryConfig.customHeaders;
        }

        return [];
    }

    private shouldAddWaitForLoadingNewContentHeader(queryConfig: IQueryConfig): boolean {
        if (queryConfig.waitForLoadingNewContent !== undefined) {
            return queryConfig.waitForLoadingNewContent;
        }

        if (!this.config.defaultQueryConfig) {
            return false;
        }

        if (this.config.defaultQueryConfig.waitForLoadingNewContent === true) {
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

        if (!this.config.defaultQueryConfig) {
            return false;
        }

        if (this.config.defaultQueryConfig.useSecuredMode === true) {
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
                throw Error(`Preview API key is not configured.`);
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
     * Header identifying SDK type & version for internal purposes of Kontent.ai
     */
    private getSdkIdHeader(): IHeader {
        return {
            header: sdkVersionHeader,
            value: `${this.sdkInfo.host};${this.sdkInfo.name};${this.sdkInfo.version}`
        };
    }

    private mapDeliveryError(error: any): DeliveryError | any {
        let axiosError: AxiosError | undefined;

        if (error.error) {
            axiosError = error.error;
        } else {
            axiosError = error;
        }

        if (!axiosError || !axiosError.isAxiosError) {
            return error;
        }

        const deliveryErrorData = axiosError.response?.data as IDeliveryErrorRaw;

        if (!deliveryErrorData || !deliveryErrorData.error_code) {
            return error;
        }

        return new DeliveryError({
            errorCode: deliveryErrorData.error_code,
            message: deliveryErrorData.message,
            specificCode: deliveryErrorData.specific_code,
            requestId: deliveryErrorData.request_id
        });
    }

    private getHasStaleContent(headers: IHeader[]): boolean {
        const hasStaleContentHeader = headers.find(
            (m) => m.header.toLowerCase() === staleContentHeaderName.toLowerCase()
        );

        if (hasStaleContentHeader) {
            if (hasStaleContentHeader.value.toString() === '1') {
                return true;
            }
        }
        return false;
    }

    private getContinuationToken(headers: IHeader[]): string | undefined {
        const header = headers.find((m) => m.header.toLowerCase() === continuationTokenHeaderName.toLowerCase());
        return header ? header.value : undefined;
    }
}
