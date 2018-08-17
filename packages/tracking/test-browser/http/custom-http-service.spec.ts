import { TrackingClient } from '../../lib';
import {
    IHttpService,
    IHttpGetQueryCall,
    IHttpPostQueryCall,
    IHttpQueryOptions,
    IBaseResponse
} from 'kentico-cloud-core';
import { Observable, of } from 'rxjs';

class CustomHttpService implements IHttpService {
    get<TError extends any>(
        call: IHttpGetQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse> {
        return of(<IBaseResponse>{
            data: undefined,
            response: undefined
        });
    }

    post<TError extends any>(
        call: IHttpPostQueryCall<TError>,
        options?: IHttpQueryOptions
    ): Observable<IBaseResponse> {
        return of(<IBaseResponse>{
            data: undefined,
            response: undefined
        });
    }
}

describe('Custom Http service', () => {
    const client = new TrackingClient({
        projectId: 'xxx',
        httpService: new CustomHttpService()
    });

    it(`Should use custom http service`, () => {
        // this is fragile, but we don't want to expose these properties for now
        const httpService = client['queryService']['httpService'];
        expect(httpService).toEqual(jasmine.any(CustomHttpService));
    });
});
