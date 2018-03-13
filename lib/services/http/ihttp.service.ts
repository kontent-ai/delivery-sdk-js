import { Observable } from 'rxjs/Observable';

import { IHeader } from '../../interfaces/common/iheader.interface';
import { BaseResponse } from './base-response.class';

export interface IHttpService {

    get(url: string, headers: IHeader[]): Observable<BaseResponse>;

}
