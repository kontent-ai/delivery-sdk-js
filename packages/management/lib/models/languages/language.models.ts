import { SharedModels } from '../shared/shared-models';

export namespace LanguageModels {
    export class LanguageModel {
        public name: string;
        public id: string;
        public codename: string;
        public externalId?: string;
        public isActive: boolean;
        public isDefault: boolean;
        public fallbackLanguage?: FallbackLanguageModel;

        constructor(data: {
            name: string;
            id: string;
            codename: string;
            externalId?: string;
            isActive: boolean;
            isDefault: boolean;
            fallbackLanguage?: FallbackLanguageModel;
        }) {
            this.name = data.name;
            this.id = data.id;
            this.codename = data.codename;
            this.externalId = data.externalId;
            this.isActive = data.isActive;
            this.isDefault = data.isDefault;
            this.fallbackLanguage = data.fallbackLanguage;
        }
    }

    export class FallbackLanguageModel {
        public id: string;

        constructor(data: { id: string }) {
            this.id = data.id;
        }
    }

    export type ModifyLanguageOperation = 'replace';

    export interface IModifyLanguageData {
        op: ModifyLanguageOperation;
        property_name: string;
        reference: SharedModels.IReferenceObject;
        value: string;
    }

    export interface IAddLanguageData {
        name: string;
        codname: string;
        is_active?: boolean;
        fallback_language?: SharedModels.IReferenceObject;
        external_id?: string;
    }
}
