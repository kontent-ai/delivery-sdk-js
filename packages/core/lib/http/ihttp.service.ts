import { Observable } from 'rxjs';

import { IBaseResponse, IHttpQueryOptions, IHttpPostQueryCall } from './http.models';

export interface IHttpService {
  post<TError extends any>(
    call: IHttpPostQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse>;
}
