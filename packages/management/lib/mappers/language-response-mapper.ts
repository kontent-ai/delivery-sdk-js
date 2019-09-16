import { IBaseResponse } from '@kentico/kontent-core';

import { LanguageContracts } from '../contracts';
import { LanguageModels } from '../models';
import { LanguageResponses } from '../responses';
import { BaseMapper } from './base-mapper';

export class LanguageResponseMapper extends BaseMapper {
    mapViewLanguageResponse(
        response: IBaseResponse<LanguageContracts.IViewLanguageResponseContract>
    ): LanguageResponses.ViewLanguageResponse {
        const language = this.mapLanguage(response.data);
        return new LanguageResponses.ViewLanguageResponse(super.mapResponseDebug(response), response.data, language);
    }

    mapModifyLanguageResponse(
        response: IBaseResponse<LanguageContracts.IModifyLanguageResponseContract>
    ): LanguageResponses.ModifyLanguageResponse {
        const language = this.mapLanguage(response.data);
        return new LanguageResponses.ModifyLanguageResponse(super.mapResponseDebug(response), response.data, language);
    }

    mapAddLanguageResponse(
        response: IBaseResponse<LanguageContracts.IAddLanguageResponseContract>
    ): LanguageResponses.AddLanguageResponse {
        const language = this.mapLanguage(response.data);
        return new LanguageResponses.AddLanguageResponse(super.mapResponseDebug(response), response.data, language);
    }

    mapListLanguagesResponse(
        response: IBaseResponse<LanguageContracts.IListLanguagesResponseContract>
    ): LanguageResponses.ListLanguagesResponse {
        const languages = response.data.languages.map(m => this.mapLanguage(m));
        return new LanguageResponses.ListLanguagesResponse(super.mapResponseDebug(response), response.data, {
            languages: languages,
            pagination: super.mapPagination(response.data.pagination)
        });
    }

    private mapLanguage(rawModel: LanguageContracts.ILanguageModelContract): LanguageModels.LanguageModel {
        return new LanguageModels.LanguageModel({
            codename: rawModel.codename,
            externalId: rawModel.external_id,
            id: rawModel.id,
            isActive: rawModel.is_active,
            isDefault: rawModel.is_default,
            name: rawModel.name,
            fallbackLanguage: rawModel.fallback_language
                ? new LanguageModels.FallbackLanguageModel({
                      id: rawModel.fallback_language.id
                  })
                : undefined
        });
    }
}

export const languageResponseMapper = new LanguageResponseMapper();
