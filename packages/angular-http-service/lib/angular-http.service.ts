import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    IBaseResponse,
    IBaseResponseError,
    IHeader,
    IHttpGetQueryCall,
    IHttpPostQueryCall,
    IHttpQueryOptions,
    IHttpService,
    retryStrategy,
} from 'kentico-cloud-core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retryWhen } from 'rxjs/operators';

@Injectable()
export class AngularHttpService implements IHttpService {

    constructor(
        private http: HttpClient
    ) { }

    get<TError extends any>(
        call: IHttpGetQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse> {

        return this.http.get(call.url, {
            headers: this.getAngularHeaders(options ? options.headers : undefined)
        }).pipe(
            map(response => <IBaseResponse>{
                data: response,
                response: undefined
            }),
            retryWhen(
                retryStrategy.strategy({
                    maxRetryAttempts:
                        options && options.maxRetryAttempts ? options.maxRetryAttempts : 0,
                    useRetryForResponseCodes:
                        options && options.useRetryForResponseCodes
                            ? options.useRetryForResponseCodes
                            : []
                })
            ),
            catchError(error => {
                if (options && options.logErrorToConsole) {
                    console.warn(
                        `Kentico Cloud SDK encountered an error posting data: `,
                        error
                    );
                }

                return throwError(<IBaseResponseError<TError>>{
                    originalError: error,
                    mappedError: call.mapError(error)
                });
            })
        );
    }

    post<TError extends any>(
        call: IHttpPostQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse> {

        return this.http.post(call.url, call.body, {
            headers: this.getAngularHeaders(options ? options.headers : undefined),

        }).pipe(
            map(response => <IBaseResponse>{
                data: response,
                response: undefined
            }),
            retryWhen(
                retryStrategy.strategy({
                    maxRetryAttempts:
                        options && options.maxRetryAttempts ? options.maxRetryAttempts : 0,
                    useRetryForResponseCodes:
                        options && options.useRetryForResponseCodes
                            ? options.useRetryForResponseCodes
                            : []
                })
            ),
            catchError(error => {
                if (options && options.logErrorToConsole) {
                    console.warn(
                        `Kentico Cloud SDK encountered an error posting data: `,
                        error
                    );
                }

                return throwError(<IBaseResponseError<TError>>{
                    originalError: error,
                    mappedError: call.mapError(error)
                });
            })
        );
    }

    private getAngularHeaders(headers?: IHeader[]): HttpHeaders | undefined {
        if (!headers) {
            return undefined;
        }

        const angularHeaders = new HttpHeaders();
        for (const header of headers) {
            angularHeaders.append(header.header, header.value);
        }

        return angularHeaders;
    }
}
