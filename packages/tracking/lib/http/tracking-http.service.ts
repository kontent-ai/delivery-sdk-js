import axios from 'axios';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IHeader, TrackingCloudError } from '../models';
import { ITrackingHttpService } from './ihttp.service';
import { IBaseResponse, IBaseResponseError } from './models';

const KCErrorNames = {
    errorId: 'error_id',
    code: 'code',
    message: 'message',
    description: 'description',
    errors: 'errors'
};

export class TrackingHttpService implements ITrackingHttpService {

    post(url: string, body: any, headers: IHeader[]): Observable<IBaseResponse> {
        return from(axios.post(url, body, {
            headers: this.getHeadersJson(headers),
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

                    let cloudError: TrackingCloudError | undefined;
                    const data = error.response.data;
                    if (data[KCErrorNames.errorId]) {
                        cloudError = new TrackingCloudError({
                            errorId: data[KCErrorNames.errorId],
                            message: data[KCErrorNames.message] ? data[KCErrorNames.message] : '',
                            description: data[KCErrorNames.description] ? data[KCErrorNames.description] : '',
                            code: data[KCErrorNames.code] ? data[KCErrorNames.code] : '',
                            errors: data[KCErrorNames.errors] ? data[KCErrorNames.errors] : undefined
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
