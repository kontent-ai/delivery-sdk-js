import { ElementContracts } from './element-contracts';
import { SharedContracts } from './shared-contracts';

export namespace LanguageVariantContracts {

    export interface ILanguageVariantModelContract {
        item: SharedContracts.IReferenceObjectContract;
        elements: ElementContracts.IContentItemElementContract[];
        language: SharedContracts.IReferenceObjectContract;
        last_modified: string;
        workflow_step: SharedContracts.IReferenceObjectContract;
    }

    export interface IListLanguageVariantsOfItemResponseContract extends ILanguageVariantModelContract {
    }

    export interface IListLanguageVariantsOfContentTypeResponseContract {
        variants: ILanguageVariantModelContract[];
        pagination: SharedContracts.IPaginationModelContract;
    }

    export interface IUpsertLanguageVariantResponseContract extends ILanguageVariantModelContract {
    }

    export interface IViewLanguageVariantResponseContract extends ILanguageVariantModelContract {
    }
}
