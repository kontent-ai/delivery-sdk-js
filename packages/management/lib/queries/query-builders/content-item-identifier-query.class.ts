import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentManagementQueryService } from '../../services';

export class ContentItemIdentifierQuery<TResult> {

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
    * @param id Internal Id of content item
    */
    byItemId(id: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.ContentItemIdentifier(Identifiers.ContentItemIdentifierEnum.InternalId, id));
    }

    /**
    * Gets query using external Id
    * @param id External Id of content item
    */
    byItemExternalId(id: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.ContentItemIdentifier(Identifiers.ContentItemIdentifierEnum.ExternalId, id));
    }

    /**
    * Gets query using codename
    * @param codename Codename of content item
    */
    byItemCodename(codename: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.ContentItemIdentifier(Identifiers.ContentItemIdentifierEnum.Codename, codename));
    }
}
