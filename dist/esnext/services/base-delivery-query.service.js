import { urlHelper, } from '@kentico/kontent-core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeliveryError } from '../models/common/common-models';
export class BaseDeliveryQueryService {
    constructor(
    /**
     * Delivery client configuration
     */
    config, 
    /**
     * Http service for fetching data
     */
    httpService, 
    /**
     * Information about the SDK
     */
    sdkInfo, 
    /**
     * Mapping service
     */
    mappingService) {
        this.config = config;
        this.httpService = httpService;
        this.sdkInfo = sdkInfo;
        this.mappingService = mappingService;
        /**
         * Header name for SDK usage
         */
        this.sdkVersionHeader = 'X-KC-SDKID';
        /**
         * Default base Url to Kentico Delivery API
         */
        this.defaultBaseDeliveryApiUrl = 'https://deliver.kontent.ai';
        /**
         * Default preview url to Kentico Delivery API
         */
        this.defaultPreviewDeliveryApiUrl = 'https://preview-deliver.kontent.ai';
        /**
         * Name of the header used when 'wait for loading new content' feature is used
         */
        this.waitForLoadingNewContentHeader = 'X-KC-Wait-For-Loading-New-Content';
    }
    /**
    * Gets url based on the action, query configuration and options (parameters)
    * @param action Action (= url part) that will be hit
    * @param queryConfig Query configuration
    * @param options Query options
    */
    getUrl(action, queryConfig, options) {
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
    getHeaders(queryConfig, additionalHeaders) {
        const headers = [];
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
        if (this.isPreviewModeEnabled(queryConfig) &&
            this.isSecuredModeEnabled(queryConfig)) {
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
    getResponse(url, queryConfig, serviceConfig) {
        if (!queryConfig) {
            queryConfig = {};
        }
        if (!serviceConfig) {
            serviceConfig = {};
        }
        return this.httpService
            .get({
            url: url,
        }, {
            retryStrategy: this.config.retryStrategy,
            headers: this.getHeaders(queryConfig, serviceConfig.headers ? serviceConfig.headers : []),
            logErrorToConsole: this.config.isDeveloperMode
        })
            .pipe(catchError((error) => {
            return throwError(this.mapDeliveryError(error));
        }));
    }
    /**
    * Gets base URL of the request including the project Id
    * @param queryConfig Query configuration
    */
    getBaseUrl(queryConfig) {
        return this.getDomain(queryConfig) + '/' + this.config.projectId;
    }
    /**
    * Indicates if current query should use preview mode
    * @param queryConfig Query configuration
    */
    isPreviewModeEnabled(queryConfig) {
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
    getQueryHeaders(queryConfig) {
        if (queryConfig.customHeaders) {
            return queryConfig.customHeaders;
        }
        if (!this.config.globalQueryConfig || !this.config.globalQueryConfig.customHeaders) {
            return [];
        }
        return this.config.globalQueryConfig.customHeaders;
    }
    shouldAddWaitForLoadingNewContentHeader(queryConfig) {
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
    isSecuredModeEnabled(queryConfig) {
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
    getDomain(queryConfig) {
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
    getAuthorizationHeader(key) {
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
    getSdkIdHeader() {
        return {
            header: this.sdkVersionHeader,
            value: `${this.sdkInfo.host};${this.sdkInfo.name};${this.sdkInfo.version}`
        };
    }
    mapDeliveryError(error) {
        var _a;
        const axiosError = error;
        if (!axiosError || !axiosError.isAxiosError) {
            return error;
        }
        const deliveryErrorData = (_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.data;
        if (!deliveryErrorData || !deliveryErrorData.error_code) {
            return error;
        }
        return new DeliveryError({
            errorCode: deliveryErrorData.error_code,
            message: deliveryErrorData.message,
            specificCode: deliveryErrorData.specific_code,
            requestId: deliveryErrorData.request_id,
        });
    }
}
//# sourceMappingURL=base-delivery-query.service.js.map