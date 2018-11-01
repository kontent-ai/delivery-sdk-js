import {
    IBaseResponse,
    IBaseResponseError,
    IHttpGetQueryCall,
    IHttpPostQueryCall,
    IHttpQueryOptions,
    IHttpService,
} from 'kentico-cloud-core';
import { Observable, of, throwError } from 'rxjs';

export class CMTestHttpService implements IHttpService {

    public throwCloudError: boolean = false;
    public fakeResponseJson: any = undefined;
    public errorJson: any = undefined;

    constructor(config: {
        fakeResponseJson?: any,
        throwCloudError?: boolean,
        errorJson?: any
    }) {
        Object.assign(this, config);
    }

    get<TError extends any, TRawData extends any>(
        call: IHttpGetQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse<TRawData>> {

        // throw cloud error
        if (this.throwCloudError) {
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

        // throw cloud error
        if (this.throwCloudError) {
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
