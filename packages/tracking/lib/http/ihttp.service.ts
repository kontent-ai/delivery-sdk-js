import { Observable } from 'rxjs';

import { IBaseResponse } from './models';
import { IHeader } from '../models';

export interface ITrackingHttpService {

    post(url: string, body: any, headers: IHeader[]): Observable<IBaseResponse>;

}
