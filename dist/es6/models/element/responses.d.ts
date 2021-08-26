import { IBaseResponse } from '@kentico/kontent-core';
import { BaseKontentResponseStandardDebug } from '../common';
import { GenericElement } from './element-models';
export declare namespace ElementResponses {
    class ViewContentTypeElementResponse extends BaseKontentResponseStandardDebug {
        element: GenericElement;
        /**
         * Response containing content type element
         *
         * @constructor
         * @param {GenericElement} element - Content type element
         */
        constructor(element: GenericElement, response: IBaseResponse<any>, isDeveloperMode: boolean);
    }
}
