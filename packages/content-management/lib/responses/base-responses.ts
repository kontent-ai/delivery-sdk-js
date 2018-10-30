export interface IContentManagementResponseDebug {
    response: any;
}

export interface IContentManagementResponse<TData extends any> {
    data: TData;
    debug: IContentManagementResponseDebug;
}

export class BaseContentManagementResponse<TData extends any> {
    constructor(
        public debug: IContentManagementResponseDebug,
        public data: TData
    ) { }
}
