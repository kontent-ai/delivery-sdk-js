import { IKontentListAllResponse, IKontentListResponse, IKontentNetworkResponse, Pagination } from '../common';
import { Language } from './language-models';

export namespace LanguageResponses {
    export class ListLanguagesResponse implements IKontentListResponse {
        constructor(
            /**
             * List of languages
             */
            public items: Language[],

            /**
             * Pagination
             */
            public pagination: Pagination
        ) {}
    }

    export class ListLanguagesAllResponse implements IKontentListAllResponse {
        constructor(public items: Language[], public responses: IKontentNetworkResponse<ListLanguagesResponse>[]) {}
    }
}
