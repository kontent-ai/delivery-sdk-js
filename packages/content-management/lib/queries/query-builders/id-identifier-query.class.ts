import { IContentManagementClientConfig } from '../../config';
import { ContentItemIdentifier } from '../../models';
import { ContentManagementQueryService } from '../../services';

export class IdIdentifierQuery<TResult> {

    constructor(
        protected config: IContentManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected constructQuery: (
            config: IContentManagementClientConfig,
            queryService: ContentManagementQueryService,
            identifier: ContentItemIdentifier,
            identifierValue: string) => TResult
    ) {
    }

    /**
   * Gets using internal Id
   * @param id Internal Id of content item
   */
    byInternalId(id: string): TResult {
        return this.constructQuery(this.config, this.queryService, ContentItemIdentifier.InternalId, id);
    }

    /**
   * Gets query using external Id
   * @param id External Id of content item
   */
    byExternalId(id: string): TResult {
        return this.constructQuery(this.config, this.queryService, ContentItemIdentifier.ExternalId, id);
    }
}
