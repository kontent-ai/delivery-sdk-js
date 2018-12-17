import { IContentManagementClientConfig } from '../../config';
import { ContentItemIdentifier } from '../../models';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class FullIdentifierQuery<TQuery extends BaseQuery<any>> {

    constructor(
        protected config: IContentManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected constructQuery: (
            config: IContentManagementClientConfig,
            queryService: ContentManagementQueryService,
            identifier: ContentItemIdentifier,
            identifierValue: string) => TQuery
    ) {
    }

    /**
   * Gets using internal Id
   * @param id Internal Id of content item
   */
    byInternalId(id: string): TQuery {
        return this.constructQuery(this.config, this.queryService, ContentItemIdentifier.InternalId, id);
    }

    /**
   * Gets query using external Id
   * @param id External Id of content item
   */
    byExternalId(id: string): TQuery {
        return this.constructQuery(this.config, this.queryService, ContentItemIdentifier.ExternalId, id);
    }

    /**
   * Gets query using codename
   * @param codename Codename of content item
   */
    byCodename(codename: string): TQuery {
        return this.constructQuery(this.config, this.queryService, ContentItemIdentifier.Codename, codename);
    }
}
