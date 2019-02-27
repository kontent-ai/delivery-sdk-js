import { IContentManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentManagementQueryService } from '../../services';

export class TaxonomyIdentifierQuery<TResult> {

    constructor(
        protected config: IContentManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected buildResult: (
            config: IContentManagementClientConfig,
            queryService: ContentManagementQueryService,
            identifier: Identifiers.TaxonomyIdentifier) => TResult
    ) {
    }

    /**
    * Gets using internal Id
    * @param id Internal Id of content item
    */
    byInternalId(id: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.TaxonomyIdentifier(Identifiers.TaxonomyIdentifierEnum.InternalId, id));
    }

    /**
    * Gets query using external Id
    * @param id External Id of content item
    */
    byExternalId(id: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.TaxonomyIdentifier(Identifiers.TaxonomyIdentifierEnum.ExternalId, id));
    }

    /**
    * Gets query using codename
    * @param codename Codename of content item
    */
    byCodename(codename: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.TaxonomyIdentifier(Identifiers.TaxonomyIdentifierEnum.Codename, codename));
    }
}
