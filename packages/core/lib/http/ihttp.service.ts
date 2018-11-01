import { Observable } from 'rxjs';

import {
  IBaseResponse,
  IHttpGetQueryCall,
  IHttpPostQueryCall,
  IHttpQueryOptions
} from './http.models';

export interface IHttpService {
  post<TError extends any, TRawData extends any>(
    call: IHttpPostQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse<TRawData>>;

  get<TError extends any, TRawData extends any>(
    call: IHttpGetQueryCall<TError>,
    options?: IHttpQueryOptions
  ): Observable<IBaseResponse<TRawData>>;
}
