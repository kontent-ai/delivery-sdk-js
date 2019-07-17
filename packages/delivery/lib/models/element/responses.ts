import { ICloudResponse, ICloudResponseDebug } from '../common';
import { GenericElement } from './element-models';

export namespace ElementResponses {

    export class ViewContentTypeElementResponse implements ICloudResponse {

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
