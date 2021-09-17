import { IKontentResponse } from '../common/common-models';
import { GenericElement } from './element-models';

export namespace ElementResponses {
    export class ViewContentTypeElementResponse implements IKontentResponse {
        /**
         * Response containing content type element
         *
         * @constructor
         * @param {GenericElement} element - Content type element
         */
        constructor(public element: GenericElement) {}
    }
}
