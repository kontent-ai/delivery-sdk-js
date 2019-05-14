import {
    CloudError,
    IBaseResponse,
    IBaseResponseError,
    IHeader,
    IHttpService,
    IQueryParameter,
    mapCloudError,
    urlHelper,
} from 'kentico-cloud-core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IDeliveryClientConfig } from '../config';
import { IQueryConfig, ISDKInfo } from '../interfaces';
import { ResponseMapper } from '../mappers';
import { IRichTextHtmlParser } from '../parser';

export abstract class BaseDeliveryQueryService {

    /**
    * Default number of retry attempts when user did not set any
    */
    private readonly defaultRetryAttempts: number = 3;

    /**
     * List of response codes that can be retried
     */
    private readonly defaultRetryStatusCodes: number[] = [500];

    /**
     * Header name for SDK usage
     */
    private readonly sdkVersionHeader: string = 'X-KC-SDKID';

    /**
     * Default base Url to Kentico Delivery API
     */
    private readonly defaultBaseDeliveryApiUrl: string =
        'https://deliver.kenticocloud.com';

    /**
     * Default preview url to Kentico Delivery API
     */
    private readonly defaultPreviewDeliveryApiUrl: string =
        'https://preview-deliver.kenticocloud.com';

    /**
     * Name of the header used when 'wait for loading new content' feature is used
     */
    private readonly waitForLoadingNewContentHeader: string =
        'X-KC-Wait-For-Loading-New-Content';

    /**
     * Service used to map responses (json) from Kentico cloud to strongly typed types
     */
    protected responseMapper: ResponseMapper;

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
         * HTML parser
         */
        protected readonly richTextHtmlParser: IRichTextHtmlParser,
        /**
         * Information about the SDK
         */
        protected readonly sdkInfo: ISDKInfo
    ) {
        if (!config) {
            throw Error(`Invalid configuration has been provided`);
        }
        this.responseMapper = new ResponseMapper(config, richTextHtmlParser);
    }

    retryPromise<T>(promise: Promise<T>): Promise<T> {
        return this.httpService.retryPromise<T>(promise, {
            maxRetryAttempts: this.getRetryAttempts(),
            useRetryForResponseCodes: this.getRetryStatusCodes()
        }, 1);
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
        if (!this.config.proxyUrl) {
            return urlHelper.addOptionsToUrl(this.getBaseUrl(queryConfig) + action, options);
        }
        return this.config.proxyUrl({
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
    * @param customHeaders Custom headers
    */
    getHeaders(queryConfig: IQueryConfig): IHeader[] {
        let headers: IHeader[] = [];

        // add headers from global config
        if (this.config.globalHeaders && this.config.globalHeaders.length > 0) {
            headers = headers.concat(this.config.globalHeaders);
        }

        // add headers from query config
        if (queryConfig.customHeaders) {
            headers = headers.concat(queryConfig.customHeaders);
        }

        // add SDK Id header for monitoring SDK usage
        headers.push(this.getSdkIdHeader());

        if (
            this.isPreviewModeEnabled(queryConfig) &&
            this.isSecuredModeEnabled(queryConfig)
        ) {
            throw Error(`Preview & secured modes cannot be used at the same time.`);
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
        queryConfig?: IQueryConfig
    ): Observable<IBaseResponse<TRawData>> {
        if (!queryConfig) {
            queryConfig = {};
        }

        return this.httpService
            .get<CloudError, TRawData>(
                {
                    url: url,
                    mapError: error => mapCloudError(error)
                },
                {
                    headers: this.getHeaders(queryConfig),
                    maxRetryAttempts: this.getRetryAttempts(),
                    useRetryForResponseCodes: this.getRetryStatusCodes(),
                    logErrorToConsole: this.config.enableAdvancedLogging
                }
            )
            .pipe(
                catchError((error: IBaseResponseError<CloudError>) => {
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
    * Gets retry status code array
    */
    private getRetryStatusCodes(): number[] {
        if (this.config.retryStatusCodes) {
            return this.config.retryStatusCodes;
        }

        return this.defaultRetryStatusCodes;
    }

    /**
    * Gets number of retry attempts used by queries
    */
    private getRetryAttempts(): number {
        // get the attempts
        let attempts: number;

        if (this.config.retryAttempts || this.config.retryAttempts === 0) {
            // use custom defined number of attempts
            attempts = this.config.retryAttempts;
        } else {
            // use default attempts
            attempts = this.defaultRetryAttempts;
        }

        return attempts;
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
    private getDomain(queryConfig: IQueryConfig): string {
        if (this.isPreviewModeEnabled(queryConfig)) {
            if (!this.config.previewApiKey) {
                throw Error(
                    `You have to configure 'previewApiKey' to use 'preview' mode`
                );
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
    * Gets authorization header. This is used for 'preview' functionality
    */
    private getAuthorizationHeader(key?: string): IHeader {
        if (!key) {
            throw Error(`Cannot get authorization header because key is undefined`);
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
