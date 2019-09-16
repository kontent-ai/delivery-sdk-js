import { IContentManagementClientConfig } from '../../config';
import { ContentManagementQueryService } from '../../services';

export class ProjectIdIdentifierQuery<TResult> {

    constructor(
        protected config: IContentManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected buildResult: (
            config: IContentManagementClientConfig,
            queryService: ContentManagementQueryService,
            projectId: string) => TResult
    ) {
    }

    /**
    * For given Project by id
    * @param projectId ProjectId
    */
    forProjectId(projectId: string): TResult {
        return this.buildResult(this.config, this.queryService, projectId);
    }
}
