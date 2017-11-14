import { AjaxResponse } from 'rxjs/Rx';
import { IncomingMessage } from 'https';

export interface ICloudResponseDebug {
    response: AjaxResponse | IncomingMessage
}
