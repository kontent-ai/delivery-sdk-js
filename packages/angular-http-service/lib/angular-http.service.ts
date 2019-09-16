import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    IBaseResponse,
    IBaseResponseError,
    IHeader,
    IHttpDeleteQueryCall,
    IHttpGetQueryCall,
    IHttpPostQueryCall,
    IHttpPutQueryCall,
    IHttpQueryCall,
    IHttpQueryOptions,
    IHttpService,
    retryStrategy,
} from '@kentico/kontent-core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retryWhen } from 'rxjs/operators';

@Injectable()
export class AngularHttpService implements IHttpService {
    constructor(private http: HttpClient) {}

    retryPromise<T>(
        promise: Promise<T>,
        options: {
            maxRetryAttempts: number;
            useRetryForResponseCodes: number[];
        },
        currentAttempt: number
    ): Promise<T> {
        return new Promise((resolve, reject) =>
            promise
                .then(response => {
                    resolve(response);
                })
                .catch((reason: any) => {
                    let statusCode = 0;

                    if (reason && reason.originalError && reason.originalError.request) {
                        statusCode = reason.originalError.request.status;
                    }

                    const retryCode = options.useRetryForResponseCodes.find(m => m === statusCode);
                    if (!retryCode && retryCode !== 0) {
                        return reject(reason);
                    }

                    const retryTimeout = this.getRetryTimeout(currentAttempt);
                    if (currentAttempt <= options.maxRetryAttempts) {
                        return this.promiseRetryWait(retryTimeout)
                            .then(() => {
                                return this.retryPromise(promise, options, currentAttempt + 1);
                            })
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                    }
                    return reject(reason);
                })
        );
    }

    get<TError extends any, TRawData extends any>(
        call: IHttpGetQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse<TRawData>> {
        const angularObs = this.http.get(call.url, {
            headers: this.getAngularHeaders(options ? options.headers : undefined)
        });

        return this.mapAngularObservable(angularObs, call, options);
    }

    post<TError extends any, TRawData extends any>(
        call: IHttpPostQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse<TRawData>> {
        const angularObs = this.http.post(call.url, call.body, {
            headers: this.getAngularHeaders(options ? options.headers : undefined)
        });

        return this.mapAngularObservable(angularObs, call, options);
    }

    put<TError extends any, TRawData extends any>(
        call: IHttpPutQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse<TRawData>> {
        const angularObs = this.http.put(call.url, call.body, {
            headers: this.getAngularHeaders(options ? options.headers : undefined)
        });

        return this.mapAngularObservable(angularObs, call, options);
    }

    delete<TError extends any, TRawData extends any>(
        call: IHttpDeleteQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse<TRawData>> {
        const angularObs = this.http.delete(call.url, {
            headers: this.getAngularHeaders(options ? options.headers : undefined)
        });

        return this.mapAngularObservable(angularObs, call, options);
    }

    private getRetryTimeout(attempt: number): number {
        return Math.pow(2, attempt) * 100;
    }

    private promiseRetryWait(ms: number): Promise<number> {
        return new Promise<number>(r => setTimeout(r, ms));
    }

    private mapAngularObservable<TError extends any, TRawData extends any>(
        obs: Observable<any>,
        call: IHttpQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse<TRawData>> {
        return obs.pipe(
            map(
                response =>
                    <IBaseResponse<TRawData>>{
                        data: response,
                        response: undefined
                    }
            ),
            retryWhen(
                retryStrategy.strategy({
                    maxRetryAttempts: options && options.maxRetryAttempts ? options.maxRetryAttempts : 0,
                    useRetryForResponseCodes:
                        options && options.useRetryForResponseCodes ? options.useRetryForResponseCodes : []
                })
            ),
            catchError(error => {
                if (options && options.logErrorToConsole) {
                    console.warn(`Kentico Kontent SDK encountered an error posting data: `, error);
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
