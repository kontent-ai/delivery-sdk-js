import axios from 'axios';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, retryWhen } from 'rxjs/operators';

import {
  IBaseResponse,
  IBaseResponseError,
  IHeader,
  IHttpGetQueryCall,
  IHttpPostQueryCall,
  IHttpQueryOptions,
} from './http.models';
import { IHttpService } from './ihttp.service';
import { retryStrategy } from './retry-strategy';

export class HttpService implements IHttpService {

  get<TError extends any>(
    call: IHttpGetQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse> {
    return from(
      axios.get(call.url, {
        headers: this.getHeadersJson(
          options && options.headers ? options.headers : []
        )
      })
    ).pipe(
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
      map(response => {
        return <IBaseResponse>{
          data: response.data,
          response: response
        };
      }),
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
    return from(
      axios.post(call.url, call.body, {
        headers: this.getHeadersJson(
          options && options.headers ? options.headers : []
        )
      })
    ).pipe(
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
      map(response => {
        return <IBaseResponse>{
          data: response.data,
          response: response
        };
      }),
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
