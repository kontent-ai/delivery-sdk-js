import { AjaxResponse } from 'rxjs/observable/dom/AjaxObservable';
import { IncomingMessage } from 'http';

export class BaseResponse {
    constructor(
        public data: JSON,
        public response: AjaxResponse | IncomingMessage
    ) {
    }
}
