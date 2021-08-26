import { IBaseResponse } from '@kentico/kontent-core';
import { BaseKontentResponseStandardDebug, Pagination } from '../common';
import { Language } from './language-models';
export declare namespace LanguageResponses {
    class ListLanguagesResponse extends BaseKontentResponseStandardDebug {
        /**
         * List of languages
         */
        languages: Language[];
        /**
         * Pagination
         */
        pagination: Pagination;
        constructor(
        /**
         * List of languages
         */
        languages: Language[], 
        /**
         * Pagination
         */
        pagination: Pagination, 
        /**
         * Response
         */
        response: IBaseResponse<any>, isDeveloperMode: boolean);
    }
}
