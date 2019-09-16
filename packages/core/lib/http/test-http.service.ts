import { Observable, of, throwError } from 'rxjs';

import {
    IBaseResponse,
    IBaseResponseError,
    IHttpDeleteQueryCall,
    IHttpGetQueryCall,
    IHttpPostQueryCall,
    IHttpPutQueryCall,
    IHttpQueryOptions,
} from './http.models';
import { IHttpService } from './ihttp.service';

export class TestHttpService implements IHttpService {

    public throwError: boolean = false;
    public fakeResponseJson: any = undefined;
    public errorJson: any = undefined;

    constructor(config: {
        fakeResponseJson?: any,
        throwError?: boolean,
        errorJson?: any
    }) {
        Object.assign(this, config);
    }

    retryPromise<T>(promise: Promise<T>,
        options: {
            maxRetryAttempts: number;
            useRetryForResponseCodes: number[];
            delay: number;
        }): Promise<T> {
        console.log('Retry is not implemented in test service. Returning original Promise');
        return promise;
    }

    get<TError extends any, TRawData extends any>(
        call: IHttpGetQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse<TRawData>> {

        // throw kontent error
        if (this.throwError) {
            const fakeError = {
                response: {
                    data: this.errorJson
                }
            };
            return throwError(<IBaseResponseError<TError>>{
                originalError: fakeError,
                mappedError: call.mapError(fakeError)
            });
        }

        // return fake response
        return of(<IBaseResponse<TRawData>>{
            data: this.fakeResponseJson,
            response: undefined
        });
    }

    post<TError extends any, TRawData extends any>(
        call: IHttpPostQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse<TRawData>> {

        // throw kontent error
        if (this.throwError) {
            const fakeError = {
                response: {
                    data: this.errorJson
                }
            };
            return throwError(<IBaseResponseError<TError>>{
                originalError: fakeError,
                mappedError: call.mapError(fakeError)
            });
        }

        // return fake response
        return of(<IBaseResponse<TRawData>>{
            data: this.fakeResponseJson,
            response: undefined
        });
    }

    put<TError extends any, TRawData extends any>(
        call: IHttpPutQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse<TRawData>> {

        // throw kontent error
        if (this.throwError) {
            const fakeError = {
                response: {
                    data: this.errorJson
                }
            };
            return throwError(<IBaseResponseError<TError>>{
                originalError: fakeError,
                mappedError: call.mapError(fakeError)
            });
        }

        // return fake response
        return of(<IBaseResponse<TRawData>>{
            data: this.fakeResponseJson,
            response: undefined
        });
    }

    delete<TError extends any, TRawData extends any>(
        call: IHttpDeleteQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse<TRawData>> {

        // throw kontent error
        if (this.throwError) {
            const fakeError = {
                response: {
                    data: this.errorJson
                }
            };
            return throwError(<IBaseResponseError<TError>>{
                originalError: fakeError,
                mappedError: call.mapError(fakeError)
            });
        }

        // return fake response
        return of(<IBaseResponse<TRawData>>{
            data: this.fakeResponseJson,
            response: undefined
        });
    }
}
