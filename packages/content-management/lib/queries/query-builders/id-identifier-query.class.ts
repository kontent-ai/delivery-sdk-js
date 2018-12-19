import { IContentManagementClientConfig } from '../../config';
import { ContentItemIdentifier } from '../../models';
import { ContentManagementQueryService } from '../../services';

export class IdIdentifierQuery<TResult> {

    constructor(
        protected config: IContentManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected buildResult: (
            config: IContentManagementClientConfig,
            queryService: ContentManagementQueryService,
            identifier: ContentItemIdentifier,
            identifierValue: string) => TResult
    ) {
    }

    /**
    * Gets using internal Id
    * @param id Internal Id
    */
    byInternalId(id: string): TResult {
        return this.buildResult(this.config, this.queryService, ContentItemIdentifier.InternalId, id);
    }

    /**
    * Gets query using external Id
    * @param id External Id
    */
    byExternalId(id: string): TResult {
        return this.buildResult(this.config, this.queryService, ContentItemIdentifier.ExternalId, id);
    }
}
