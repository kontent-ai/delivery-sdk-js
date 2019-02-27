import { IContentManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentManagementQueryService } from '../../services';

export class LanguageIdentifierQuery<TResult> {

    constructor(
        protected config: IContentManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected buildResult: (
            config: IContentManagementClientConfig,
            queryService: ContentManagementQueryService,
            identifier: Identifiers.LanguageIdentifier) => TResult
    ) {
    }

    /**
    * Gets using internal Id
    * @param id Internal Id
    */
    forLanguageId(id: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.LanguageIdentifier(Identifiers.LanguageIdentifierEnum.InternalId, id));
    }

    /**
    * Gets query using codename
    * @param codename Codename
    */
    forLanguageCodename(codename: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.LanguageIdentifier(Identifiers.LanguageIdentifierEnum.Codename, codename));
    }
}
