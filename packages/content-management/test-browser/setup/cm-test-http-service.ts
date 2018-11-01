import {
    IBaseResponse,
    IBaseResponseError,
    IHttpGetQueryCall,
    IHttpPostQueryCall,
    IHttpQueryOptions,
    IHttpService,
} from 'kentico-cloud-core';
import { Observable, of, throwError } from 'rxjs';

import * as fakeErrorJson from '../fake-responses/fake-error.json';

export class CMTestHttpService implements IHttpService {

    public throwCloudError: boolean = false;
    public fakeResponseJson: any = undefined;

    constructor(config: {
        fakeResponseJson: any,
        throwCloudError: boolean
    }) {
        Object.assign(this, config);
    }

    get<TError extends any>(
        call: IHttpGetQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse> {

        // throw cloud error
        if (this.throwCloudError) {
            const fakeError = {
                response: {
                    data: fakeErrorJson
                }
            };
            return throwError(<IBaseResponseError<TError>>{
                originalError: fakeError,
                mappedError: call.mapError(fakeError)
            });
        }

        // return fake response
        return of(<IBaseResponse>{
            data: this.fakeResponseJson,
            response: undefined
        });
    }

    post<TError extends any>(
        call: IHttpPostQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse> {

        // throw cloud error
        if (this.throwCloudError) {
            const fakeError = {
                response: {
                    data: fakeErrorJson
                }
            };
            return throwError(<IBaseResponseError<TError>>{
                originalError: fakeError,
                mappedError: call.mapError(fakeError)
            });
        }

        // return fake response
        return of(<IBaseResponse>{
            data: this.fakeResponseJson,
            response: undefined
        });
    }
}
