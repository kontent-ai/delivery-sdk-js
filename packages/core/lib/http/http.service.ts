import { AxiosResponse } from 'axios';
import { bindCallback, Observable, throwError } from 'rxjs';
import { catchError, map, retryWhen } from 'rxjs/operators';

import * as HttpFunctions from './http.functions';
import {
  IBaseResponse,
  IBaseResponseError,
  IHttpDeleteQueryCall,
  IHttpGetQueryCall,
  IHttpPostQueryCall,
  IHttpPutQueryCall,
  IHttpQueryCall,
  IHttpQueryOptions,
  IHttpRequestResult,
} from './http.models';
import { IHttpService } from './ihttp.service';
import { retryService } from './retry-service';
import { retryStrategy } from './retry-strategy';

export class HttpService implements IHttpService {

  /**
   * Retries given promise based on given configuration
   * @param promise Promise to retry
   * @param options Configuration options
   */
  retryPromise<T>(promise: Promise<T>, options: {
    maxRetryAttempts: number
    useRetryForResponseCodes: number[],
  }): Promise<T> {
    return new Promise((resolve, reject) => promise
      .then(() => {
        resolve();
      })
      .catch((reason: any) => {
        let statusCode = 0;

        if (reason && reason.originalError && reason.originalError.request) {
          statusCode = reason.originalError.request.status;

          const retryCode = options.useRetryForResponseCodes.find(m => m === statusCode);
          if (!retryCode && retryCode !== 0) {
            return reject(reason);
          }
        }

        const newRetryAttempts = options.maxRetryAttempts - 1;
        const retryTimeout = retryService.getRetryTimeout(newRetryAttempts);

        retryService.debugLogAttempt(newRetryAttempts, retryTimeout);

        if (options.maxRetryAttempts - 1 > 0) {
          return this.promiseRetryWait(retryTimeout)
            .then(() => {
              return this.retryPromise(promise, {
                maxRetryAttempts: newRetryAttempts,
                useRetryForResponseCodes: options.useRetryForResponseCodes
              });
            })
            .then(() => resolve())
            .catch(() => reject(reason));
        }
        return reject(reason);
      })
    );
  }


  get<TError extends any, TRawData extends any>(
    call: IHttpGetQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse<TRawData>> {

    // bind callback from axios promise
    const axiosObservable = bindCallback(HttpFunctions.getCallback);

    // map axios observable
    return this.mapAxiosObservable(axiosObservable, call, options);
  }

  post<TError extends any, TRawData extends any>(
    call: IHttpPostQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse<TRawData>> {

    // bind callback from axios promise
    const axiosObservable = bindCallback(HttpFunctions.postCallback);

    // map axios observable
    return this.mapAxiosObservable(axiosObservable, call, options);
  }

  put<TError extends any, TRawData extends any>(
    call: IHttpPutQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse<TRawData>> {

    // bind callback from axios promise
    const axiosObservable = bindCallback(HttpFunctions.putCallback);

    // map axios observable
    return this.mapAxiosObservable(axiosObservable, call, options);
  }

  delete<TError extends any, TRawData extends any>(
    call: IHttpDeleteQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse<TRawData>> {

    // bind callback from axios promise
    const axiosObservable = bindCallback(HttpFunctions.deleteCallback);

    // map axios observable
    return this.mapAxiosObservable(axiosObservable, call, options);
  }

  private mapAxiosObservable<TRawData, TError>(axiosObservable: (...args: any[]) => Observable<any>, call: IHttpQueryCall<TError>, options?: IHttpQueryOptions): Observable<IBaseResponse<TRawData>> {
    return axiosObservable(call, options).pipe(
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
      map((result: IHttpRequestResult<AxiosResponse>) => this.mapResult<TRawData>(result)),
      catchError(error => {
        // Handling errors: https://github.com/axios/axios#handling-errors
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

  private mapResult<TRawData>(result: IHttpRequestResult<AxiosResponse>): IBaseResponse<TRawData> {
    // if error is set, throw it
    if (result.error) {
      throw result.error;
    }

    // if neither error nor response is set, throw an error
    if (!result.response) {
      throw Error('Response is not set and no error was thrown');
    }

    return <IBaseResponse<TRawData>>{
      data: result.response.data,
      response: result.response
    };
  }

  private promiseRetryWait(ms: number): Promise<number> {
    return new Promise<number>(r => setTimeout(r, ms));
  }
}
