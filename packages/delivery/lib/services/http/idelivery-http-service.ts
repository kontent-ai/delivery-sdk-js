import { Observable } from 'rxjs';

import { IHeader } from '../../interfaces';
import { IBaseResponse } from './models';

export interface IDeliveryHttpService {

    get(url: string, headers: IHeader[]): Observable<IBaseResponse>;

}
