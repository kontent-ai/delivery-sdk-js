import { Observable } from 'rxjs';

import { IHeader } from '../../interfaces';
import { IBaseResponse } from './models';

export interface IHttpService {

    get(url: string, headers: IHeader[]): Observable<IBaseResponse>;

}
