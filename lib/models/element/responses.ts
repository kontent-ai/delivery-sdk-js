import { ICloudResponse } from '../../interfaces/common/icloud-response.interface';
import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';
import { IElementOption } from '../../interfaces/element/ielement-option.interface';
import { IElement } from '../../interfaces/element/ielement.interface';

export namespace ElementResponses {

    export class ElementResponse implements ICloudResponse {

        /**
        * Response containing content type element
        *
        * @constructor
        * @param {IElement} element - Content type element
        * @param {ICloudResponseDebug} debug - Debug information from the response
        */
        constructor(
            public element: IElement,
            public debug: ICloudResponseDebug,
        ) { }
    }
}
