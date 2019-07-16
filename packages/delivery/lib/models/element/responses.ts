import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';
import { ICloudResponse } from '../../interfaces/common/icloud-response.interface';
import { GenericElement } from './generic-element.class';

export namespace ElementResponses {

    export class ElementResponse implements ICloudResponse {

        /**
        * Response containing content type element
        *
        * @constructor
        * @param {GenericElement} element - Content type element
        * @param {ICloudResponseDebug} debug - Debug information from the response
        */
        constructor(
            public element: GenericElement,
            public debug: ICloudResponseDebug,
        ) { }
    }
}
