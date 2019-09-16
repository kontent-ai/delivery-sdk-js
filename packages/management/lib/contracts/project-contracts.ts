export namespace ProjectContracts {

    export interface IProjectReportResponseContract {
        project: IProjectReportModelContract;
        variant_issues: IProjectVariantIssueContract[];
        type_issues: IProjectTypeIssueContract[];
    }

    export interface IProjectReportModelContract {
        id: string;
        name: string;
    }

    export interface IProjectVariantContentItemContract {
        id: string;
        name: string;
        codename: string;
    }

    export interface IProjectVariantLanguageContract {
        id: string;
        name: string;
        codename: string;
    }

    export interface IProjectVariantElementContract {
        id: string;
        name: string;
        codename: string;
    }

    export interface IProjectTypeContract {
        id: string;
        name: string;
        codename: string;
    }

    export interface IProjectTypeIssueContract {
        type: IProjectTypeContract;
        issues: IProjectIssueContract[];
    }

    export interface IProjectIssueContract {
        element: IProjectVariantElementContract;
        messages: string[];
    }

    export interface IProjectVariantIssueContract {
        item: IProjectVariantContentItemContract;
        language: IProjectVariantLanguageContract;
        issues: IProjectIssueContract[];
    }

}
