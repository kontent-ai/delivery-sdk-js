import { Observable, throwError } from 'rxjs';
import { catchError, map, retryWhen } from 'rxjs/operators';

import { ITrackingClientConfig } from '../config/itracking-client-config.interface';
import { IBaseResponse, IBaseResponseError, ITrackingHttpService, retryStrategy } from '../http';
import { trackingResponseMapper } from '../mappers';
import {
    IContactProfileData,
    IContactRequiredData,
    IHeader,
    IQueryParameter,
    ISDKInfo,
    TrackingCloudError,
    TrackingEmptySuccessResponse,
    ITrackingQueryConfig,
} from '../models';

export class TrackingQueryService {

    /**
    * Header name for SDK usage
    */
    private readonly sdkVersionHeader: string = 'X-KC-SDKID';

    private readonly defaultBaseTrackingUrl: string = 'https://engage-ket.kenticocloud.com/v3/track';

    /**
     * Default number of retry attempts when user did not set any
     */
    private readonly defaultRetryAttempts: number = 3;

    /**
     * Allowed retry status codes
     */
    private readonly useRetryForResponseCodes: number[] = [500];

    constructor(
        protected config: ITrackingClientConfig,
        protected httpService: ITrackingHttpService,
        protected sdkInfo: ISDKInfo,
    ) { }

    recordNewSession(url: string, contactData: IContactRequiredData, config?: ITrackingQueryConfig): Observable<TrackingEmptySuccessResponse> {
        return this.postResponse(url, {
            uid: contactData.uid,
            sid: contactData.sid
        }, config)
            .pipe(
                map(response => {
                    return trackingResponseMapper.mapEmptyTrackingSuccessResponse(response);
                }),
                catchError(err => {
                    return throwError(this.handleError(err));
                })
            );
    }

    recordCustomActivity(url: string, contactData: IContactRequiredData, activityCodename: string,  config?: ITrackingQueryConfig): Observable<TrackingEmptySuccessResponse> {
        return this.postResponse(url, {
            uid: contactData.uid,
            sid: contactData.sid,
            codename: activityCodename
        }, config)
            .pipe(
                map(response => {
                    return trackingResponseMapper.mapEmptyTrackingSuccessResponse(response);
                }),
                catchError(err => {
                    return throwError(this.handleError(err));
                })
            );
    }

    createContactProfile(url: string, contactProfile: IContactProfileData, config?: ITrackingQueryConfig): Observable<TrackingEmptySuccessResponse> {
        return this.postResponse(url, {
            uid: contactProfile.uid,
            sid: contactProfile.sid,
            email: contactProfile.email,

            name: contactProfile.name,
            company: contactProfile.company,
            phone: contactProfile.phone,
            website: contactProfile.website
        }, config)
            .pipe(
                map(response => {
                    return trackingResponseMapper.mapEmptyTrackingSuccessResponse(response);
                }),
                catchError(err => {
                    return throwError(this.handleError(err));
                })
            );
    }

    /**
     * Gets url based on the action, query configuration and options (parameters)
     * @param action Action (= url part) that will be hit
     * @param options Query options
     */
    getUrl(action: string, options?: IQueryParameter[]): string {
        return this.addOptionsToUrl(this.getBaseUrl() + action, options);
    }

    /**
   * Gets proper set of headers for given request.
   */
    getHeaders(): IHeader[] {
        const headers: IHeader[] = [
            // sdk tracking header
            this.getSdkIdHeader()
        ];

        return headers;
    }

    /**
    * Http POST response
    * @param url Url of request
    * @param body Body of the request (names and values)
    * @param config Query configuration
    */
    protected postResponse(url: string, body: any, config?: ITrackingQueryConfig): Observable<IBaseResponse> {
        if (!config) {
            config = {};
        }

        return this.httpService.post(url, body, this.getHeaders())
            .pipe(
                retryWhen(retryStrategy.strategy({
                    maxRetryAttempts: this.getRetryAttempts(),
                    useRetryForResponseCodes: config.forceRetry ? [] : this.useRetryForResponseCodes
                })),
                catchError(err => {
                    return throwError(this.handleError(err));
                })
            );
    }

    /**
     * Handles given error
     * @param error Error to be handled
     */
    private handleError(error: IBaseResponseError): TrackingCloudError | any {
        if (this.config.enableAdvancedLogging) {
            console.error(error);
        }

        if (error.cloudError) {
            return error.cloudError;
        }

        return error;
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
    * Gets base URL of the request including the project Id
    */
    private getBaseUrl(): string {
        return this.getTrackingUrl() + '/' + this.config.projectId;
    }

    /**
    * Gets url to tracking API endpoind
    */
    private getTrackingUrl(): string {
        if (this.config.baseUrl) {
            return this.config.baseUrl;
        }
        return this.defaultBaseTrackingUrl;
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
     * Header identifying SDK type & version for internal purposes of Kentico
     */
    private getSdkIdHeader(): IHeader {
        return {
            header: this.sdkVersionHeader,
            value: `${this.sdkInfo.host};${this.sdkInfo.name};${this.sdkInfo.version}`
        };
    }
}
