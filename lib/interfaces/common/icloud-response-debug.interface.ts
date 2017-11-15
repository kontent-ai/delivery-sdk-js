import { AjaxResponse } from 'rxjs/Rx';
import { IncomingMessage } from 'http';

export interface ICloudResponseDebug {
    rawResponse: AjaxResponse | IncomingMessage
}
