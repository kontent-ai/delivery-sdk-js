import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentManagementQueryService } from '../../services';

export class ContentTypeCodenameAndExternalIdIdentifierQuery<TResult> {

    constructor(
        protected config: IManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected buildResult: (
            config: IManagementClientConfig,
            queryService: ContentManagementQueryService,
            identifier: Identifiers.ContentTypeIdentifier) => TResult
    ) {
    }

    /**
    * Gets query using external Id
    * @param id External Id of content item
    */
    byTypeExternalId(id: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.ContentTypeIdentifier(Identifiers.ContentTypeIdentifierEnum.ExternalId, id));
    }

    /**
    * Gets query using codename
    * @param codename Codename of content item
    */
    byTypeCodename(codename: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.ContentTypeIdentifier(Identifiers.ContentTypeIdentifierEnum.Codename, codename));
    }
}
