/* Do NOT export this class, it should be used in browsers only as it depends on XMLHttpRequest */
import { bindCallback, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as xhr from 'xhr';

import { IHeader } from '../lib/interfaces';
import { IBaseResponse, IBaseResponseError, IHttpService } from '../lib/services';

interface IHttpCallback {
    data: any;
    response: XMLHttpRequest | any;
    error?: string;
}

export class HttpService implements IHttpService {

    private readonly kenticoCloudErrorNames = {
        errorCode: 'error_code',
        message: 'message',
        requestId: 'request_id',
        specificCode: 'specific_code'
    };

    get(url: string, headers: IHeader[]): Observable<IBaseResponse> {
        return this.getDataObservable(url, this.getHeadersJson(headers))
            .pipe(
                map((callback: IHttpCallback) => {

                    // check if request was successful by checking if error is defined
                    if (callback.error) {
                        // check if its a Kentico specific error by looking up one of the
                        // properties of such response
                        if (callback.data[this.kenticoCloudErrorNames.requestId]) {

                            throw <IBaseResponseError>{
                                cloudError: {
                                    errorCode: callback.data[this.kenticoCloudErrorNames.errorCode],
                                    message: callback.data[this.kenticoCloudErrorNames.message],
                                    requestId: callback.data[this.kenticoCloudErrorNames.requestId],
                                    specificCode: callback.data[this.kenticoCloudErrorNames.specificCode],
                                },
                                message: callback.error,
                                response: callback.response,
                            };
                        }

                        throw <IBaseResponseError>{
                            response: callback.response,
                            message: callback.error
                        };
                    }

                    return <IBaseResponse>{
                        data: callback.data ? callback.data : {},
                        response: callback.response
                    };
                }),
        );
    }

    private getData(url: string, headers: any, callback: any): void {

        xhr({
            method: 'GET',
            uri: url,
            headers: headers
            // response can be either XMLHttpRequest or 'XDomainRequest' in case of IE8 & IE9. XDomainRequest is now obsolete
        }, function (error: Error, response: XMLHttpRequest | any, body: string) {
            let callbackError: string | undefined = undefined;

            if (error) {
                callbackError = `Error during http request: '${error.message}'. Stacktrace: '${error.stack}'`;
            }

            if (!response) {
                callbackError = `Http response from '${url}' http request is invalid`;
            }

            if (response.statusCode < 200 || response.statusCode >= 300) {
                callbackError = `Http request failed with status code: '${response.statusCode}'`;
            }

            callback(<IBaseResponse>{
                data: body ? JSON.parse(body) : {},
                response: response,
                error: callbackError
            });
        });
    }

    private getDataObservable(url: string, headers: any): Observable<any> {
        return bindCallback(this.getData)(url, headers);
    }

    private getHeadersJson(headers: IHeader[]): any {
        const headerJson: any = {
            'Content-Type': 'application/json'
        };

        if (!headers) {
            return headerJson;
        }

        headers.forEach(header => {
            headerJson[header.header] = header.value;
        });

        return headerJson;
    }
}
