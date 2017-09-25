import { ITaxonomyQueryConfig } from '../../interfaces/taxonomy/itaxonomy-query.config'
import { QueryConfig } from '../common/query.config';

export class TaxonomyQueryConfig extends QueryConfig implements ITaxonomyQueryConfig {

    constructor(
        protected options?: {
            usePreviewMode?: boolean,
            waitForLoadingNewContent?: boolean
        }
    ) {
        super(options)
    }
}
