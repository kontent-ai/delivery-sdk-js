import { AjaxResponse } from 'rxjs/observable/dom/AjaxObservable';
import { IncomingMessage } from 'https';

export class BaseResponse {
    constructor(
        public data: JSON,
        public response: AjaxResponse | IncomingMessage
    ) {
    }
}
