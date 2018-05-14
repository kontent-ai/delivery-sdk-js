import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';
import { ICloudResponse } from '../../interfaces/common/icloud-response.interface';
import { Element } from './element.class';

export namespace ElementResponses {

    export class ElementResponse implements ICloudResponse {

        /**
        * Response containing content type element
        *
        * @constructor
        * @param {Element} element - Content type element
        * @param {ICloudResponseDebug} debug - Debug information from the response
        */
        constructor(
            public element: Element,
            public debug: ICloudResponseDebug,
        ) { }
    }
}
