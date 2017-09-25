import { IContentTypeQueryConfig } from '../../interfaces/type/icontent-type-query.config'
import { QueryConfig } from '../common/query.config';

export class ContentTypeQueryConfig extends QueryConfig implements IContentTypeQueryConfig {

    constructor(
        protected options?: {
            usePreviewMode?: boolean,
            waitForLoadingNewContent?: boolean
        }
    ) {
        super(options)
    }
}
