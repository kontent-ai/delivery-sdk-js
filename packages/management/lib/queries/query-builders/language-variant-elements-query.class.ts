import { IManagementClientConfig } from '../../config';
import { LanguageVariantModels } from '../../models';
import { ContentManagementQueryService } from '../../services';

export class LanguageVariantElementsQuery<TResult> {

    constructor(
        protected config: IManagementClientConfig,
        protected queryService: ContentManagementQueryService,
        protected buildResult: (
            config: IManagementClientConfig,
            queryService: ContentManagementQueryService,
            data: LanguageVariantModels.ILanguageVariantElement[]) => TResult
    ) {
    }

    /**
     * Specifies which content elements to update. Each content element is represented as a key-value pair.
     * The element values can be strings, numbers, or Reference objects, depending on the element type.
     * If you don't provide any value for the elements attribute, the language variant will not be modified.
     * @param elements Elements
     */
    withElements(elements: LanguageVariantModels.ILanguageVariantElement[]): TResult {
        return this.buildResult(this.config, this.queryService, elements);
    }

    /**
     * Same as 'withElements' but always uses 'codename' to identify elements which results in shorter and cleaner syntax
     * @param elements Simplified elements
     */
    withElementCodenames(elements: LanguageVariantModels.ILanguageVariantElementCodename[]): TResult {
        return this.buildResult(this.config, this.queryService, elements.map(m => <LanguageVariantModels.ILanguageVariantElement>({
            element: {
                codename: m.codename
            },
            value: m.value
        })));
    }
}
