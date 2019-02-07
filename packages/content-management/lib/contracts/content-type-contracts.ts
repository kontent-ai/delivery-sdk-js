import { ElementContracts } from './element-contracts';
import { SharedContracts } from './shared-contracts';

export namespace ContentTypeContracts {

    export interface IContentTypeContract {
        id: string;
        name: string;
        codename: string;
        last_modified: string;
        elements: ElementContracts.IContentTypeElementContract[];
    }

    export interface IContentTypeListResponseContract {
        types: IContentTypeContract[];
        pagination: SharedContracts.IPaginationModelContract;
    }

    export interface IViewContentTypeResponseContract extends IContentTypeContract {
    }

    export interface IDeleteContentTypeResponseContract {
    }

    export interface IAddContentTypeResponseContract extends IContentTypeContract {
    }
}
