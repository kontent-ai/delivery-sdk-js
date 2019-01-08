export namespace ProjectModels {

    export class ProjectReportModel {
        constructor(
            public id: string,
            public name: string,
        ) { }
    }

    export class ProjectVariantContentItemModel {
        constructor(
            public id: string,
            public name: string,
            public codename: string,
        ) { }
    }

    export class ProjectVariantLanguageModel {
        constructor(
            public id: string,
            public name: string,
            public codename: string,
        ) { }
    }

    export class ProjectVariantElementModel {
        constructor(
            public id: string,
            public name: string,
            public codename: string,
        ) { }
    }

    export class ProjectTypeIssueModel {
        constructor(
            public type: ProjectTypeModel,
            public issues: ProjectIssueModel[],
        ) { }
    }

    export class ProjectTypeModel {
        constructor(
            public id: string,
            public name: string,
            public codename: string,
        ) { }
    }

    export class ProjectIssueModel {
        constructor(
            public element: ProjectVariantElementModel,
            public messages: string[],
        ) { }
    }

    export class ProjectVariantIssueModel {
        constructor(
            public item: ProjectVariantContentItemModel,
            public language: ProjectVariantLanguageModel,
            public issues: ProjectIssueModel[],
        ) { }
    }

}
