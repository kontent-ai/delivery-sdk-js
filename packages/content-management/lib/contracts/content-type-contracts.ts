import { ElementContracts } from './element-contracts';
import { SharedContracts } from './shared-contracts';

export namespace ContentTypeContracts {

    export interface IContentTypeContract {
        id: string;
        name: string;
        codename: string;
        last_modified: string;
        elements: ElementContracts.IElementContract[];
    }

    export interface IContentTypeListResponse {
        types: IContentTypeContract[];
        pagination: SharedContracts.IPaginationModelContract;
    }

    export interface IViewContentTypeResponse extends IContentTypeContract {
    }
}
