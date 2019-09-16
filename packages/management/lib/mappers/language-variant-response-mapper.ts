import { IBaseResponse } from '@kentico/kontent-core';

import { LanguageVariantContracts } from '../contracts';
import { LanguageVariantModels } from '../models';
import { LanguageVariantResponses } from '../responses';
import { BaseMapper } from './base-mapper';
import { elementsMapper } from './elements-mapper';

export class LanguageVariantResponseMapper extends BaseMapper {

    mapUpsertLanguageVariantResponse(
        response: IBaseResponse<LanguageVariantContracts.IUpsertLanguageVariantResponseContract>,
    ): LanguageVariantResponses.UpsertLanguageVariantResponse {
        const variant = this.mapLanguageVariant(response.data);
        return new LanguageVariantResponses.UpsertLanguageVariantResponse(super.mapResponseDebug(response), response.data, variant);
    }

    mapViewLanguageVariantResponse(
        response: IBaseResponse<LanguageVariantContracts.IViewLanguageVariantResponseContract>,
    ): LanguageVariantResponses.ViewLanguageVariantResponse {
        const variant = this.mapLanguageVariant(response.data);
        return new LanguageVariantResponses.ViewLanguageVariantResponse(super.mapResponseDebug(response), response.data, variant);
    }

    mapLanguageVariantsOfItemResponse(
        response: IBaseResponse<LanguageVariantContracts.IListLanguageVariantsOfItemResponseContract[]>,
    ): LanguageVariantResponses.ListLanguageVariantsOfItemResponse {
        const variants = response.data.map(m => this.mapLanguageVariant(m));
        return new LanguageVariantResponses.ListLanguageVariantsOfItemResponse(super.mapResponseDebug(response), response.data, {
            variants: variants
        });
    }

    mapLanguageVariantsOfContentTypeResponse(
        response: IBaseResponse<LanguageVariantContracts.IListLanguageVariantsOfContentTypeResponseContract>,
    ): LanguageVariantResponses.ListLanguageVariantsOfContentTypeResponse {
        const variants = response.data.variants.map(m => this.mapLanguageVariant(m));
        return new LanguageVariantResponses.ListLanguageVariantsOfContentTypeResponse(super.mapResponseDebug(response), response.data, {
            variants: variants,
            pagination: super.mapPagination(response.data.pagination)
        });
    }

    private mapLanguageVariant(rawVariant: LanguageVariantContracts.ILanguageVariantModelContract): LanguageVariantModels.ContentItemLanguageVariant {
        return new LanguageVariantModels.ContentItemLanguageVariant({
            rawElements: rawVariant.elements,
            elements: elementsMapper.mapElements(rawVariant.elements),
            item: super.mapReference(rawVariant.item),
            language: super.mapReference(rawVariant.language),
            lastModified: new Date(rawVariant.last_modified),
            workflowStep: super.mapReference(rawVariant.workflow_step)
        });
    }
}

export const languageVariantResponseMapper = new LanguageVariantResponseMapper();
