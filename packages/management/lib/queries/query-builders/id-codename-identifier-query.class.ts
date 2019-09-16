import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentManagementQueryService } from '../../services';

export class IdCodenameIdentifierQuery<TResult> {

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
    * Gets query using codename
    * @param codename Codename
    */
    byItemCodename(codename: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.ContentItemIdentifier(Identifiers.ContentItemIdentifierEnum.Codename, codename));
    }
}
