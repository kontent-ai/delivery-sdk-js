import { Observable } from 'rxjs';

import {
  IBaseResponse,
  IHttpGetQueryCall,
  IHttpPostQueryCall,
  IHttpQueryOptions
} from './http.models';

export interface IHttpService {
  post<TError extends any>(
    call: IHttpPostQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse>;

  get<TError extends any>(
    call: IHttpGetQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse>;
}
