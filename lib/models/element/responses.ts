import { IKontentResponse } from '../common/common-models';
import { IGenericElement } from './element-models';

export namespace ElementResponses {
    export interface IViewContentTypeElementResponse extends IKontentResponse {
        /**
         * Response containing content type element
         *
         * @constructor
         * @param {IGenericElement} element - Content type element
         */
        element: IGenericElement;
    }
}
