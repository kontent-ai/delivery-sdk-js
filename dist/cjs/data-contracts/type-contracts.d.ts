import { IElementContract } from './shared/elements.interface';
import { IPaginationContract } from './shared/ipagination.interface';
export declare namespace TypeContracts {
    interface IContentTypeSystemAttributesContract {
        id: string;
        name: string;
        codename: string;
        last_modified: Date;
    }
    interface IContentTypeContract {
        system: IContentTypeSystemAttributesContract;
        elements: IElementContract;
    }
    interface IListContentTypeContract {
        types: IContentTypeContract[];
        pagination: IPaginationContract;
    }
    interface IViewContentTypeContract extends IContentTypeContract {
    }
}
