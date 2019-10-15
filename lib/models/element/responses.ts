import { IBaseResponse } from '@kentico/kontent-core';

import { BaseKontentResponse } from '../common';
import { GenericElement } from './element-models';

export namespace ElementResponses {
    export class ViewContentTypeElementResponse extends BaseKontentResponse {
        /**
         * Response containing content type element
         *
         * @constructor
         * @param {GenericElement} element - Content type element
         */
        constructor(public element: GenericElement, response: IBaseResponse<any>, isDeveloperMode: boolean) {
            super(response, isDeveloperMode);
        }
    }
}
