import { IResponse } from '@kentico/kontent-core';

import { BaseKontentResponseStandardDebug } from '../common';
import { GenericElement } from './element-models';

export namespace ElementResponses {
    export class ViewContentTypeElementResponse extends BaseKontentResponseStandardDebug {
        /**
         * Response containing content type element
         *
         * @constructor
         * @param {GenericElement} element - Content type element
         */
        constructor(public element: GenericElement, response: IResponse<any>) {
            super(response);
        }
    }
}
