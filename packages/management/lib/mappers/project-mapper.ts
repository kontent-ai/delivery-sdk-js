import { IBaseResponse } from '@kentico/kontent-core';

import { ProjectContracts } from '../contracts';
import { ProjectModels } from '../models/projects/project-report.models';
import { ProjectResponses } from '../responses';
import { BaseMapper } from './base-mapper';

export class ProjectMapper extends BaseMapper {

    mapValidateProjectContentResponse(
        response: IBaseResponse<ProjectContracts.IProjectReportResponseContract>
    ): ProjectResponses.ValidateProjectContentResponse {

        return new ProjectResponses.ValidateProjectContentResponse(super.mapResponseDebug(response), response.data, {
            project: this.mapProjectModel(response.data.project),
            typeIssues: response.data.type_issues.map(m => this.mapTypeIssue(m)),
            variantIssues: response.data.variant_issues.map(m => this.mapVariantIssue(m))
        });
    }

    private mapProjectModel(raw: ProjectContracts.IProjectReportModelContract): ProjectModels.ProjectReportModel {
        return new ProjectModels.ProjectReportModel(raw.id, raw.name);
    }

    private mapTypeModel(raw: ProjectContracts.IProjectTypeContract): ProjectModels.ProjectTypeModel {
        return new ProjectModels.ProjectTypeModel(raw.id, raw.name, raw.codename);
    }

    private mapItemModel(raw: ProjectContracts.IProjectVariantContentItemContract): ProjectModels.ProjectVariantContentItemModel {
        return new ProjectModels.ProjectVariantContentItemModel(raw.id, raw.name, raw.codename);
    }

    private mapLanguageModel(raw: ProjectContracts.IProjectVariantLanguageContract): ProjectModels.ProjectVariantLanguageModel {
        return new ProjectModels.ProjectVariantLanguageModel(raw.id, raw.name, raw.codename);
    }

    private mapIssueModel(raw: ProjectContracts.IProjectIssueContract): ProjectModels.ProjectIssueModel {
        return new ProjectModels.ProjectIssueModel(
            this.mapVariantElementModel(raw.element),
            raw.messages
        );
    }

    private mapTypeIssue(raw: ProjectContracts.IProjectTypeIssueContract): ProjectModels.ProjectTypeIssueModel {
        return new ProjectModels.ProjectTypeIssueModel(
            this.mapTypeModel(raw.type),
            raw.issues.map(m => this.mapIssueModel(m)),
        );
    }

    private mapVariantIssue(raw: ProjectContracts.IProjectVariantIssueContract): ProjectModels.ProjectVariantIssueModel {
        return new ProjectModels.ProjectVariantIssueModel(
            this.mapItemModel(raw.item),
            this.mapLanguageModel(raw.language),
            raw.issues.map(m => this.mapIssueModel(m)),
        );
    }

    private mapVariantElementModel(raw: ProjectContracts.IProjectVariantElementContract): ProjectModels.ProjectVariantElementModel {
        return new ProjectModels.ProjectVariantElementModel(raw.id, raw.name, raw.codename);
    }
}

export const projectMapper = new ProjectMapper();
