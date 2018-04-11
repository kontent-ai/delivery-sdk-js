import axios, { AxiosResponse } from 'axios';
import { bindCallback, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IHeader } from '../../interfaces';
import { CloudError } from '../../models';
import { IHttpService } from './ihttp.service';
import { IBaseResponse, IBaseResponseError } from './models';

interface IHttpCallback {
    data?: any;
    response?: AxiosResponse<any>;
    error?: {
        message: string,
        originalError: any,
        cloudError?: CloudError
    };
}

const KCErrorNames = {
    errorCode: 'error_code',
    message: 'message',
    requestId: 'request_id',
    specificCode: 'specific_code'
};

export class AxiosHttpService implements IHttpService {

    get(url: string, headers: IHeader[]): Observable<IBaseResponse> {
        return this.getDataObservable(url, this.getHeadersJson(headers))
            .pipe(
                map((callback: IHttpCallback) => {
                    // data should be already parsed as json by axios
                    const data = callback.data ? callback.data : {};

                    // check if request was successful by checking if error is defined
                    if (callback.error) {
                        throw <IBaseResponseError>(callback.error);
                    }

                    return <IBaseResponse>{
                        data: data,
                        response: callback.response
                    };
                }),
        );
    }

    private getData(url: string, headers: any, callback: any): void {

        axios.get(url, {
            headers: headers
        })
            .then((response) => {
                callback(<IHttpCallback>{
                    data: response.data,
                    response: response,
                });
            })
            .catch((error) => {
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

                    callback(<IHttpCallback>{
                        error: {
                            message: error.message,
                            originalError: error,
                            cloudError: cloudError
                        }
                    });
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    callback(<IHttpCallback>{
                        error: {
                            message: error.message,
                            originalError: error
                        }
                    });
                } else {
                    // Something happened in setting up the request that triggered an Error
                    callback(<IHttpCallback>{
                        error: {
                            message: error.message,
                            originalError: error
                        }
                    });
                }
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
