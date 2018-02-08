import { AjaxResponse } from 'rxjs/Rx';

import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';

export class CloudResponseDebug implements ICloudResponseDebug {
    constructor(
        public rawResponse: AjaxResponse | any) {
    }
}
