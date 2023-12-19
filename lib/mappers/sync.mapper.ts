import { Contracts } from '../contracts';
import { IContentItemDelta } from '../models';

export class SyncMapper {
    mapContentItemDelta(itemDeltaContract: Contracts.IContentItemDeltaContract): IContentItemDelta {
        const systemContract = itemDeltaContract.data.system;

        const elements: Contracts.IContentItemElementsContracts = itemDeltaContract.data.elements
            ? itemDeltaContract.data.elements
            : {};

        return {
            changeType: itemDeltaContract.change_type,
            timestamp: itemDeltaContract.timestamp,
            data: {
                elements: elements,
                system: {
                    codename: systemContract.codename,
                    collection: systemContract.collection,
                    id: systemContract.id,
                    language: systemContract.language,
                    lastModified: systemContract.last_modified,
                    name: systemContract.name,
                    sitemapLocations: systemContract.sitemap_locations,
                    type: systemContract.type,
                    workflowStep: systemContract.workflow_step ?? null,
                    workflow: systemContract.workflow ?? null
                }
            }
        };
    }
}
