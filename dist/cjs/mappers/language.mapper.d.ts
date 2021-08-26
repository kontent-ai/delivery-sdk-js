import { LanguageContracts } from '../data-contracts';
import { Language } from '../models';
export declare class LanguageMapper {
    mapMultipleLanguages(response: LanguageContracts.IListLanguagesContract): Language[];
    private mapLanguage;
}
