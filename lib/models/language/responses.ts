import { IKontentListAllResponse, IKontentListResponse, IKontentNetworkResponse, IPagination } from '../common';
import { Language } from './language-models';

export namespace LanguageResponses {
    export interface IListLanguagesResponse extends IKontentListResponse {
        items: Language[];
        pagination: IPagination;
    }

    export interface IListLanguagesAllResponse extends IKontentListAllResponse {
        items: Language[];
        responses: IKontentNetworkResponse<IListLanguagesResponse>[];
    }
}
