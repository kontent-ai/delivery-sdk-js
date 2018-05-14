import { IElementOptionContract } from './shared/elements.interface';

export namespace ElementContracts {

    export interface IElementResponseContract {
        type: string;
        name: string;
        codename: string;
        taxonomy_group?: string;
        options?: IElementOptionContract[];
    }
}
