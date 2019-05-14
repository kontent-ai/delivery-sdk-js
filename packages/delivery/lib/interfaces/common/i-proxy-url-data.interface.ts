import { IQueryParameter } from 'kentico-cloud-core';

import { IQueryConfig } from './iquery.config';

export interface IProxyUrlData {
    action: string;
    domain: string;
    queryParameters: IQueryParameter[];
    queryString: string;
    queryConfig: IQueryConfig;
    projectId: string;
}
