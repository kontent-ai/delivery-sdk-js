import axios, { AxiosInstance, AxiosResponse } from 'axios';
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
  IHttpRequestConfig,
  IHttpRequestResponse,
  IHttpRequestResult,
} from './http.models';
import { IHttpService } from './ihttp.service';
import { retryService } from './retry-service';
import { retryStrategy } from './retry-strategy';

export class HttpService implements IHttpService {

  private axiosInstance: AxiosInstance;

  constructor(
    opts?: {
      requestInterceptor?: (config: IHttpRequestConfig, ) => IHttpRequestConfig,
      responseInterceptor?: (config: IHttpRequestResponse) => IHttpRequestResponse,
    }
  ) {
    this.axiosInstance = axios.create();

    if (opts) {
      if (opts.requestInterceptor) {
        HttpFunctions.registerRequestInterceptor(this.axiosInstance, (opts.requestInterceptor));
      }
      if (opts.responseInterceptor) {
        HttpFunctions.registerResponseInterceptor(this.axiosInstance, (opts.responseInterceptor));
      }
    }
  }

  /**
   * Retries given promise based on given configuration
   * @param promise Promise to retry
   * @param options Configuration options
   */
  retryPromise<T>(promise: Promise<T>, options: {
    maxRetryAttempts: number
    useRetryForResponseCodes: number[],
  }, currentAttempt: number = 1): Promise<T> {
    return new Promise((resolve, reject) => promise
      .then((response) => {
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

        const retryTimeout = retryService.getRetryTimeout(currentAttempt);
        if (currentAttempt <= options.maxRetryAttempts) {
          return this.promiseRetryWait(retryTimeout)
            .then(() => {
              retryService.debugLogAttempt(currentAttempt, retryTimeout);
              return this.retryPromise(promise, options, currentAttempt + 1);
            })
            .then((response) => resolve(response))
            .catch((error) => reject(error));
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
    return this.mapAxiosObservable(this.axiosInstance, axiosObservable, call, options);
  }

  post<TError extends any, TRawData extends any>(
    call: IHttpPostQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse<TRawData>> {

    // bind callback from axios promise
    const axiosObservable = bindCallback(HttpFunctions.postCallback);

    // map axios observable
    return this.mapAxiosObservable(this.axiosInstance, axiosObservable, call, options);
  }

  put<TError extends any, TRawData extends any>(
    call: IHttpPutQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse<TRawData>> {

    // bind callback from axios promise
    const axiosObservable = bindCallback(HttpFunctions.putCallback);

    // map axios observable
    return this.mapAxiosObservable(this.axiosInstance, axiosObservable, call, options);
  }

  delete<TError extends any, TRawData extends any>(
    call: IHttpDeleteQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse<TRawData>> {

    // bind callback from axios promise
    const axiosObservable = bindCallback(HttpFunctions.deleteCallback);

    // map axios observable
    return this.mapAxiosObservable(this.axiosInstance, axiosObservable, call, options);
  }

  private mapAxiosObservable<TRawData, TError>(axiosInstance: AxiosInstance, axiosObservable: (...args: any[]) => Observable<any>, call: IHttpQueryCall<TError>, options?: IHttpQueryOptions): Observable<IBaseResponse<TRawData>> {
    return axiosObservable(axiosInstance, call, options).pipe(
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
            `Kentico Kontent SDK encountered an error: `,
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
