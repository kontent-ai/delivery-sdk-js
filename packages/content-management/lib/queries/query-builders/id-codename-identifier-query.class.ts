import { IContentManagementClientConfig } from '../../config';
import { ContentItemIdentifier } from '../../models';
import { ContentManagementQueryService } from '../../services';

export class IdCodenameIdentifierQuery<TResult> {

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
    * @param id Internal Id
    */
    byInternalId(id: string): TResult {
        return this.constructQuery(this.config, this.queryService, ContentItemIdentifier.InternalId, id);
    }

    /**
    * Gets query using codename
    * @param codename Codename
    */
    byCodename(id: string): TResult {
        return this.constructQuery(this.config, this.queryService, ContentItemIdentifier.Codename, id);
    }
}
