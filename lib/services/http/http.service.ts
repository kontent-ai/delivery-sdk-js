import * as request from 'browser-request';
import { bindCallback, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IHeader } from '../../interfaces/common/iheader.interface';
import { IHttpService } from './ihttp.service';
import { IBaseResponse, IBaseCloudError } from './models';

interface IHttpCallback {
    data: JSON;
    response: XMLHttpRequest;
    error?: string;
}

export class HttpService implements IHttpService {

    get(url: string, headers: IHeader[]): Observable<IBaseResponse> {
        return this.getDataObservable(url, this.getHeadersJson(headers))
            .pipe(
                map((callback: IHttpCallback) => {
                    if (callback.error) {
                        if (callback.data['request_id']) {
                            // means its kentico cloud specific error
                            throwError(<IBaseCloudError> {
                                error_code: callback.data['error_code'],
                                message: callback.data['message'],
                                request_id: callback.data['request_id'],
                                specific_code: callback.data['specific_code'],
                            });
                        }
                        // throw error
                        throwError(callback.error);
                    }

                    return <IBaseResponse>{
                        data: callback.data,
                        response: callback.response
                    };
                }),
            );
    }

    private getData(url: string, headers: IHeader[], callback: any): void {
        request({ method: 'GET', url: url, body: '{"relaxed":true}', json: true }, (responseError: any, response: XMLHttpRequest, body: JSON) => {
            let error: string | undefined = undefined;

            if (responseError) {
                error = responseError;
            }

            if (!response){
                error = `Http response is invalid`;
            }

            if (response.status < 200 || response.status >= 300) {
                error = 'Response is not successful';
            }

            callback(<IBaseResponse>{
                data: body,
                response: response,
                error: error
            });
        });
    }

    private getDataObservable(url: string, headers: IHeader[]): Observable<any> {
        return bindCallback(this.getData)(url, headers);
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
