import { IKontentListAllResponse, IKontentListResponse, IKontentNetworkResponse, IPagination } from '../common';
import { ILanguage } from './language-models';

export namespace LanguageResponses {
    export interface IListLanguagesResponse extends IKontentListResponse {
        items: ILanguage[];
        pagination: IPagination;
    }

    export interface IListLanguagesAllResponse extends IKontentListAllResponse {
        items: ILanguage[];
        responses: IKontentNetworkResponse<IListLanguagesResponse>[];
    }
}
