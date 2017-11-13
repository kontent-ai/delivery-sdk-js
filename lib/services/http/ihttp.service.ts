import { BaseResponse } from './base-response.class';
import { Observable } from 'rxjs/Rx';
import { IHeader } from '../../interfaces/common/iheader.interface';

export interface IHttpService {

    get(url: string, headers: IHeader[]): Observable<BaseResponse>;

}
