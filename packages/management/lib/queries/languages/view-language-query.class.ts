import { Observable } from 'rxjs';

import { IManagementClientConfig } from '../../config';
import { Identifiers } from '../../models';
import { LanguageResponses } from '../../responses';
import { ContentManagementQueryService } from '../../services';
import { BaseQuery } from '../base-query';

export class ViewLanguageQuery extends BaseQuery<LanguageResponses.ViewLanguageResponse> {
    constructor(
        protected config: IManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        public identifier: Identifiers.LanguageIdentifier
    ) {
        super(config, queryService);
    }

    toObservable(): Observable<LanguageResponses.ViewLanguageResponse> {
        return this.queryService.viewLanguage(this.getUrl(), this.queryConfig);
    }

    protected getAction(): string {
        return this.apiEndpoints.viewLanguage(this.identifier);
    }
}
