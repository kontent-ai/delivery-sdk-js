import axios from 'axios';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IHeader } from '../../interfaces';
import { CloudError } from '../../models';
import { IHttpService } from './ihttp.service';
import { IBaseResponse, IBaseResponseError } from './models';

const KCErrorNames = {
    errorCode: 'error_code',
    message: 'message',
    requestId: 'request_id',
    specificCode: 'specific_code'
};

export class AxiosHttpService implements IHttpService {

    get(url: string, headers: IHeader[]): Observable<IBaseResponse> {
        return from(axios.get(url, {
            headers: this.getHeadersJson(headers)
        })).pipe(
            map(response => {
                return <IBaseResponse>{
                    data: response.data,
                    response: response
                };
            }),
            catchError(error => {
                // Handling errors: https://github.com/axios/axios#handling-errors
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx

                    let cloudError: CloudError | undefined;
                    const data = error.response.data;
                    if (data[KCErrorNames.requestId]) {
                        cloudError = new CloudError({
                            requestId: data[KCErrorNames.requestId],
                            message: data[KCErrorNames.message] ? data[KCErrorNames.message] : '',
                            errorCode: data[KCErrorNames.errorCode] ? data[KCErrorNames.errorCode] : 0,
                            specificCode: data[KCErrorNames.specificCode] ? data[KCErrorNames.specificCode] : 0
                        });
                    }

                    return throwError((<IBaseResponseError>{
                        message: error.message,
                        originalError: error,
                        cloudError: cloudError
                    }));
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    return throwError((<IBaseResponseError>{
                        message: error.message,
                        originalError: error
                    }));
                }

                // Something happened in setting up the request that triggered an Error
                return throwError((<IBaseResponseError>{
                    message: error.message,
                    originalError: error,
                }));
            })
        );
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
