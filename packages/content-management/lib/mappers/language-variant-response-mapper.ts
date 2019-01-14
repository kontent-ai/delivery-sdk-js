import { IBaseResponse } from 'kentico-cloud-core';

import { LanguageVariantContracts } from '../contracts';
import { LanguageVariantModels } from '../models';
import { LanguageVariantResponses } from '../responses';
import { BaseMapper } from './base-mapper';
import { elementsMapper } from './elements-mapper';

export class LanguageVariantResponseMapper extends BaseMapper {

    mapLanguageVariantsResponse(
        response: IBaseResponse<LanguageVariantContracts.IListLanguageVariantsResponseContract[]>,
    ): LanguageVariantResponses.ListLanguageVariantsResponse {
        const variants = response.data.map(m => this.mapLanguageVariant(m));
        return new LanguageVariantResponses.ListLanguageVariantsResponse(super.mapResponseDebug(response), response.data, {
            variants: variants
        });
    }

    private mapLanguageVariant(rawVariant: LanguageVariantContracts.ILanguageVariantModelContract): LanguageVariantModels.ContentItemLanguageVariant {

        return new LanguageVariantModels.ContentItemLanguageVariant({
            rawElements: rawVariant.elements,
            elements: elementsMapper.mapElements(rawVariant.elements),
            item: super.mapReference(rawVariant.item),
            language: super.mapReference(rawVariant.language),
            lastModified: new Date(rawVariant.last_modified)
        });
    }
}

export const languageVariantResponseMapper = new LanguageVariantResponseMapper();
