import { IQueryConfig } from './common/common-models';

export interface ISyncInitQueryConfig extends IQueryConfig {
    /**
     * No dedicated properties required at this moment
     */
}

export interface IContentItemDelta {
    codename: string;
    id: string;
    type: string;
    language: string;
    collection: string;
    changeType: 'changed' | 'deleted';
    timestamp: string;
}
