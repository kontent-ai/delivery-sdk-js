import { Contracts } from '../contracts';
import { IQueryConfig } from './common/common-models';
import { IContentItemSystemAttributes } from './item-models';

export interface ISyncInitQueryConfig extends IQueryConfig {
    /**
     * No dedicated properties required at this moment
     */
}

export interface IContentItemDelta {
    data: {
        system: IContentItemSystemAttributes;
        elements: Contracts.IContentItemElementsContracts;
    };
    changeType: 'deleted_item' | 'changed_item';
    timestamp: string;
}
