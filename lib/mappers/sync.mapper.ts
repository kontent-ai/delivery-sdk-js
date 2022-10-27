import { Contracts } from '../contracts';
import { IContentItemDelta } from '../models';

export class SyncMapper {
    mapContentItemDelta(itemDeltaContract: Contracts.IContentItemDeltaContract): IContentItemDelta {
        return {
            changeType: itemDeltaContract.change_type,
            codename: itemDeltaContract.codename,
            collection: itemDeltaContract.collection,
            id: itemDeltaContract.id,
            language: itemDeltaContract.language,
            timestamp: itemDeltaContract.timestamp,
            type: itemDeltaContract.type
        };
    }
}
