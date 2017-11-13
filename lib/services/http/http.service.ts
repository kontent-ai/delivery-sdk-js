// rxjs observable
import { ajax } from 'rxjs/observable/dom/ajax';
import { AjaxResponse, AjaxError } from 'rxjs/observable/dom/AjaxObservable';
import { Observable } from 'rxjs/Rx';

// interfaces
import { IHttpService } from './ihttp.service';

// models
import { BaseResponse } from './base-response.class';
import { IHeader } from '../../interfaces/common/iheader.interface';

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
