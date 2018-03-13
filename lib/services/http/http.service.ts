import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
import { ajax } from 'rxjs/observable/dom/ajax';
import { AjaxResponse } from 'rxjs/observable/dom/AjaxObservable';

import { IHeader } from '../../interfaces/common/iheader.interface';
import { BaseResponse } from './base-response.class';
import { IHttpService } from './ihttp.service';

export class HttpService implements IHttpService {

    get(url: string, headers: IHeader[]): Observable<BaseResponse> {
        return ajax.get(url, this.getHeadersJson(headers))
            .map((ajaxResponse: AjaxResponse) => {
                return new BaseResponse(ajaxResponse.response, ajaxResponse);
            });
    }

    private getHeadersJson(headers: IHeader[]): any {
        const headerJson: any = {};

        if (!headers) {
            return headerJson;
        }

        headers.forEach(header => {
            headerJson[header.header] = header.value;
        });

        return headerJson;
    }
}
