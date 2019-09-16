import { ElementContracts } from './element-contracts';
import { SharedContracts } from './shared-contracts';

export namespace ContentTypeSnippetContracts {

    export interface IContentTypeSnippetContract {
        id: string;
        name: string;
        codename: string;
        last_modified: string;
        elements: ElementContracts.IContentTypeElementContract[];
    }

    export interface IContentTypeSnippetListResponseContract {
        snippets: IContentTypeSnippetContract[];
        pagination: SharedContracts.IPaginationModelContract;
    }

    export interface IViewContentTypeSnippetResponseContract extends IContentTypeSnippetContract {
    }

    export interface IAddContentTypeSnippetResponseContract extends IContentTypeSnippetContract {
    }

    export interface IDeleteContentTypeSnippetResponseContract {
    }
}
