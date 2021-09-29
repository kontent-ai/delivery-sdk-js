import { LanguageContracts } from '../../data-contracts';
import { IKontentListAllResponse, IKontentListResponse, INetworkResponse, IPagination } from '../common';
import { ILanguage } from './language-models';

export namespace LanguageResponses {
    export interface IListLanguagesResponse extends IKontentListResponse {
        items: ILanguage[];
        pagination: IPagination;
    }

    export interface IListLanguagesAllResponse extends IKontentListAllResponse {
        items: ILanguage[];
        responses: INetworkResponse<IListLanguagesResponse, LanguageContracts.IListLanguagesContract>[];
    }
}
