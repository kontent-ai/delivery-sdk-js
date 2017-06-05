import { IQueryConfig } from '../../interfaces/item/iquery.config';

export class QueryConfig implements IQueryConfig {

    public urlSlugResolver?: (fieldName: string, value: string) => string;

    constructor(
        config?: {
            urlSlugResolver?: (fieldName: string, value: string) => string
        }) {
        if (config) Object.assign(this, config);
    }
}