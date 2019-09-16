import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentManagementQueryService } from '../../services';

export class IdIdentifierQuery<TResult> {

    constructor(
        protected config: IManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected buildResult: (
            config: IManagementClientConfig,
            queryService: ContentManagementQueryService,
            identifier: Identifiers.ContentItemIdentifier) => TResult
    ) {
    }

    /**
    * Gets using internal Id
    * @param id Internal Id
    */
    byItemId(id: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.ContentItemIdentifier(Identifiers.ContentItemIdentifierEnum.InternalId, id));
    }

    /**
    * Gets query using external Id
    * @param externalId External Id
    */
    byItemExternalId(externalId: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.ContentItemIdentifier(Identifiers.ContentItemIdentifierEnum.ExternalId, externalId));
    }
}
