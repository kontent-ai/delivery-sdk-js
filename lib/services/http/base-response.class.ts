import { AjaxResponse } from 'rxjs/observable/dom/AjaxObservable';

export class BaseResponse {
    constructor(
        public data: JSON,
        public response: AjaxResponse | any
    ) {
    }
}
