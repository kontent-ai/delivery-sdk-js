import { ITrackingClientConfig } from '../config';
import { IContactProfileData, IContactRequiredData } from '../models';
import { CreateContactProfile, RecordCustomActivityQuery, RecordNewSessionQuery } from '../query';

export interface ITrackingClient {

    setConfig(config: ITrackingClientConfig): void;
    getConfig(): ITrackingClientConfig;

    recordNewSession(contactData: IContactRequiredData): RecordNewSessionQuery;
    recordCustomActivity(contactData: IContactRequiredData, ativityCodename: string): RecordCustomActivityQuery;
    createContactProfile(contactData: IContactProfileData): CreateContactProfile;
}
