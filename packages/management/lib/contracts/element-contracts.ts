import { SharedContracts } from './shared-contracts';

export namespace ElementContracts {

    export interface IContentTypeElementMultipleChoiceElementOptionsContract {
        name: string;
        id: string;
        codename: string;
    }

    export enum IContentTypeElementModeTypeContract {
        single = 'single',
        multiple = 'multiple'
    }

    export interface IContentTypeElementContract {
        id: string;
        name?: string;
        codename: string;
        type: string;
        guidelines: string;
        options?: IContentTypeElementMultipleChoiceElementOptionsContract[];
        mode?: IContentTypeElementModeTypeContract;
    }

    export interface IContentItemElementContract {
        element: SharedContracts.IReferenceObjectContract;
        value: string | number | SharedContracts.IReferenceObjectContract[];
    }

}
