import { IKontentResponse, IKontentResponseDebug } from '../common';
import { GenericElement } from './element-models';

export namespace ElementResponses {

    export class ViewContentTypeElementResponse implements IKontentResponse {

        /**
        * Response containing content type element
        *
        * @constructor
        * @param {GenericElement} element - Content type element
        * @param {IKontentResponseDebug} debug - Debug information from the response
        */
        constructor(
            public element: GenericElement,
            public debug: IKontentResponseDebug,
        ) { }
    }
}
