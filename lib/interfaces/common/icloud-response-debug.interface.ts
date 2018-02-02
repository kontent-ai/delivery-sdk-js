import { IncomingMessage } from 'http';
import { AjaxResponse } from 'rxjs/Rx';

export interface ICloudResponseDebug {
    rawResponse: AjaxResponse | IncomingMessage
}
