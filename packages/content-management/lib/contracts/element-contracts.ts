import { SharedContracts } from './shared-contracts';

export namespace ElementContracts {

    export interface IContentTypeElementContract {
        id: string;
        name: string;
        codename: string;
        type: string;
        guidelines: string;
    }

    export interface IContentItemElementContract {
        element: SharedContracts.IReferenceObjectContract;
        value: string | number | SharedContracts.IReferenceObjectContract[];
    }


}
