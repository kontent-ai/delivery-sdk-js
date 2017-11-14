import { ICloudResponseDebug } from '../../interfaces/common/icloud-response-debug.interface';
import { AjaxResponse } from 'rxjs/Rx';
import { IncomingMessage } from 'http';

export class CloudResponseDebug implements ICloudResponseDebug {
    constructor(
        public response: AjaxResponse | IncomingMessage) {
    }
}
