import { HttpService } from 'kentico-cloud-core';

import { ITrackingClientConfig } from '../config';
import { IContactProfileData, IContactRequiredData } from '../models';
import { CreateContactProfile, RecordCustomActivityQuery, RecordNewSessionQuery } from '../query';
import { sdkInfo } from '../sdk-info.generated';
import { TrackingQueryService } from '../services';
import { ITrackingClient } from './itracking-client.interface';

export class TrackingClient implements ITrackingClient {
    private queryService: TrackingQueryService;

    constructor(
        /**
         * Tracking client configuration
         */
        protected config: ITrackingClientConfig
    ) {
        this.queryService = new TrackingQueryService(
            config,
            config.httpService ? config.httpService : new HttpService(),
            {
            host: sdkInfo.host,
            name: sdkInfo.name,
            version: sdkInfo.version
        });
    }

    recordNewSession(contactData: IContactRequiredData): RecordNewSessionQuery {
        return new RecordNewSessionQuery(
            this.config,
            this.queryService,
            contactData
        );
    }
    recordCustomActivity(
        contactData: IContactRequiredData,
        ativityCodename: string
    ): RecordCustomActivityQuery {
        return new RecordCustomActivityQuery(
            this.config,
            this.queryService,
            contactData,
            ativityCodename
        );
    }
    createContactProfile(contactData: IContactProfileData): CreateContactProfile {
        return new CreateContactProfile(
            this.config,
            this.queryService,
            contactData
        );
    }

    getConfig(): ITrackingClientConfig {
        return this.config;
    }

    setConfig(config: ITrackingClientConfig): void {
        this.config = config;
    }
}
