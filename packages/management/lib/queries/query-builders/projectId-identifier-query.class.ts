import { IManagementClientConfig } from '../../config';
import { ContentManagementQueryService } from '../../services';

export class ProjectIdIdentifierQuery<TResult> {

    constructor(
        protected config: IManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected buildResult: (
            config: IManagementClientConfig,
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
