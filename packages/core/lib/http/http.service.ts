import { bindCallback, Observable, throwError } from 'rxjs';
import { catchError, map, retryWhen } from 'rxjs/operators';

import * as HttpFunctions from './http.functions';
import { IBaseResponse, IBaseResponseError, IHttpGetQueryCall, IHttpPostQueryCall, IHttpQueryOptions, IHttpRequestResult } from './http.models';
import { IHttpService } from './ihttp.service';
import { retryStrategy } from './retry-strategy';
import { AxiosResponse } from 'axios';

export class HttpService implements IHttpService {

  get<TError extends any>(
    call: IHttpGetQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse> {

    // bind callback from axios promise
    const axiosObservable = bindCallback(HttpFunctions.getCallback);

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
      map((result: IHttpRequestResult<AxiosResponse>) => this.mapResult(result)),
      catchError(error => {
        // Handling errors: https://github.com/axios/axios#handling-errors
        if (options && options.logErrorToConsole) {
          console.warn(
            `Kentico Cloud SDK encountered an error loading data: `,
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

    // bind callback from axios promise
    const axiosObservable = bindCallback(HttpFunctions.postCallback);

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
      map((result: IHttpRequestResult<AxiosResponse>) => this.mapResult(result)),
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


  private mapResult(result: IHttpRequestResult<AxiosResponse>): IBaseResponse {
    // if error is set, throw it
    if (result.error) {
      throw result.error;
    }

    // if neither error nor response is set, throw an error
    if (!result.response) {
      throw Error('Response is not set and no error was thrown');
    }

    return <IBaseResponse>{
      data: result.response.data,
      response: result.response
    };
  }
}
