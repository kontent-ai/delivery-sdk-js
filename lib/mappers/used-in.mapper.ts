import { Contracts } from '../contracts';
import { ClientTypes, IUsedInItemRecord } from '../models';

export class UsedInMapper<TClientTypes extends ClientTypes> {
    mapUsedInItem(response: Contracts.IUsedInItemContract): IUsedInItemRecord<TClientTypes> {
        return {
            system: {
                id: response.system.id,
                name: response.system.name,
                codename: response.system.codename,
                language: response.system.language,
                type: response.system.type,
                collection: response.system.collection,
                workflow: response.system.workflow,
                workflowStep: response.system.workflow_step,
                lastModified: response.system.last_modified
            }
        };
    }
}
