import {
    headerHelper,
    HttpService,
    IBaseResponse,
    IHeader,
    IHttpService,
    IQueryParameter,
    ISDKInfo,
    urlHelper,
} from 'kentico-cloud-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ITrackingClientConfig } from '../config/itracking-client-config.interface';
import { mapTrackingError, trackingResponseMapper } from '../mappers';
import {
    IContactProfileData,
    IContactRequiredData,
    ITrackingQueryConfig,
    TrackingCloudError,
    TrackingEmptySuccessResponse,
} from '../models';

export class TrackingQueryService {
    private readonly defaultBaseTrackingUrl: string = 'https://engage-ket.kenticocloud.com/v3/track';

    /**
     * Default number of retry attempts when user did not set any
     */
    private readonly defaultRetryAttempts: number = 3;

    /**
     * Allowed retry status codes
     */
    private readonly useRetryForResponseCodes: number[] = [500];

    /**
     * Service for making HTTP requests
     */
    private readonly httpService: IHttpService = new HttpService();

    constructor(
        protected config: ITrackingClientConfig,
        protected sdkInfo: ISDKInfo
    ) { }

    recordNewSession(
        url: string,
        contactData: IContactRequiredData,
        config?: ITrackingQueryConfig
    ): Observable<TrackingEmptySuccessResponse> {
        return this.postResponse(
            url,
            {
                uid: contactData.uid,
                sid: contactData.sid
            },
            config
        ).pipe(
            map(response => {
                return trackingResponseMapper.mapEmptyTrackingSuccessResponse(response);
            })
        );
    }

    recordCustomActivity(
        url: string,
        contactData: IContactRequiredData,
        activityCodename: string,
        config?: ITrackingQueryConfig
    ): Observable<TrackingEmptySuccessResponse> {
        return this.postResponse(
            url,
            {
                uid: contactData.uid,
                sid: contactData.sid,
                codename: activityCodename
            },
            config
        ).pipe(
            map(response => {
                return trackingResponseMapper.mapEmptyTrackingSuccessResponse(response);
            })
        );
    }

    createContactProfile(
        url: string,
        contactProfile: IContactProfileData,
        config?: ITrackingQueryConfig
    ): Observable<TrackingEmptySuccessResponse> {
        return this.postResponse(
            url,
            {
                uid: contactProfile.uid,
                sid: contactProfile.sid,
                email: contactProfile.email,

                name: contactProfile.name,
                company: contactProfile.company,
                phone: contactProfile.phone,
                website: contactProfile.website
            },
            config
        ).pipe(
            map(response => {
                return trackingResponseMapper.mapEmptyTrackingSuccessResponse(response);
            })
        );
    }

    /**
     * Gets url based on the action, query configuration and options (parameters)
     * @param action Action (= url part) that will be hit
     * @param options Query options
     */
    getUrl(action: string, options?: IQueryParameter[]): string {
        return urlHelper.addOptionsToUrl(this.getBaseUrl() + action, options);
    }

    /**
     * Gets proper set of headers for given request.
     */
    getHeaders(): IHeader[] {
        const headers: IHeader[] = [
            // sdk tracking header
            headerHelper.getSdkIdHeader({
                host: this.sdkInfo.host,
                name: this.sdkInfo.name,
                version: this.sdkInfo.version
            })
        ];

        return headers;
    }

    /**
     * Http POST response
     * @param url Url of request
     * @param body Body of the request (names and values)
     * @param config Query configuration
     */
    protected postResponse(
        url: string,
        body: any,
        config?: ITrackingQueryConfig
    ): Observable<IBaseResponse> {
        if (!config) {
            config = {};
        }

        return this.httpService.post<TrackingCloudError | any>(
            {
                url: url,
                body: body,
                mapError: error => mapTrackingError(error)
            },
            {
                headers: this.getHeaders(),
                maxRetryAttempts: this.getRetryAttempts(),
                useRetryForResponseCodes: this.useRetryForResponseCodes,
                logErrorToConsole: this.config.enableAdvancedLogging
            }
        );
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
}
