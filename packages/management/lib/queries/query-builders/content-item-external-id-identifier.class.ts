import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { ContentManagementQueryService } from '../../services';

export class ContentItemExternalIdIdentifierQuery<TResult> {

    constructor(
        protected config: IManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected buildResult: (
            config: IManagementClientConfig,
            queryService: ContentManagementQueryService,
            identifier: Identifiers.ContentItemIdentifier) => TResult
    ) {
    }

    byItemExternalId(externalId: string): TResult {
        return this.buildResult(this.config, this.queryService, new Identifiers.ContentItemIdentifier(Identifiers.ContentItemIdentifierEnum.ExternalId, externalId));
    }
}
