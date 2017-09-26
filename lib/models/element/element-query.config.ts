import { IElementQueryConfig } from '../../interfaces/element/ielement-query.config'
import { QueryConfig } from '../common/query.config';

export class ElementQueryConfig extends QueryConfig implements IElementQueryConfig {

    constructor(
        protected options?: {
            /**
             * Indicates if preview mode is used
             */
            usePreviewMode?: boolean,
            /**
             * Indicates if the response should wait for new content
             */
            waitForLoadingNewContent?: boolean
        }
    ) {
        super(options)
    }
}
