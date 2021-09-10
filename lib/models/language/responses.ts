import { IResponse } from '@kentico/kontent-core';

import { BaseGroupedKontentResponse, BaseKontentResponse, IKontentListAllResponse, IKontentListResponse, Pagination } from '../common';
import { Language } from './language-models';

export namespace LanguageResponses {

    export class ListLanguagesResponse extends BaseKontentResponse implements IKontentListResponse {
        constructor(
            /**
             * List of languages
             */
            public items: Language[],

            /**
             * Pagination
             */
            public pagination: Pagination,

            /**
             * Response
             */
            response: IResponse<any>,
        ) {
            super(response);
        }
    }

    export class ListLanguagesAllResponse extends BaseGroupedKontentResponse implements IKontentListAllResponse {
        constructor(public items: Language[], public responses: ListLanguagesResponse[]) {
            super(responses);
        }
    }
}
