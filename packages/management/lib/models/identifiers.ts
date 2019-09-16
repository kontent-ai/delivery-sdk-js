export namespace Identifiers {

    export enum ContentItemIdentifierEnum {
        ExternalId = 'externalId',
        InternalId = 'internalId',
        Codename = 'codename'
    }

    export enum ContentTypeIdentifierEnum {
        ExternalId = 'externalId',
        InternalId = 'internalId',
        Codename = 'codename'
    }

    export enum LanguageIdentifierEnum {
        InternalId = 'internalId',
        Codename = 'codename',
        ExternalId = 'externalId'
    }

    export enum WorkflowIdentifierEnum {
        Id = 'id'
    }

    export enum TaxonomyIdentifierEnum {
        InternalId = 'internalId',
        ExternalId = 'externalId',
        Codename = 'codename'
    }

    export enum AssetIdentifierEnum {
        InternalId = 'internalId',
        ExternalId = 'externalId',
    }

    export class AssetIdentifier {
        constructor(
            public identifier: AssetIdentifierEnum,
            public value: string) {
        }

        getParamValue(): string {
            if (this.identifier === AssetIdentifierEnum.InternalId) {
                return `${this.value}`;
            }
            if (this.identifier === AssetIdentifierEnum.ExternalId) {
                return `external-id/${this.value}`;
            }
            throw Error(`Unsupported identifier '${this.identifier}'`);
        }
    }

    export class TaxonomyIdentifier {
        constructor(
            public identifier: TaxonomyIdentifierEnum,
            public value: string) {
        }

        getParamValue(): string {
            if (this.identifier === TaxonomyIdentifierEnum.InternalId) {
                return `${this.value}`;
            }
            if (this.identifier === TaxonomyIdentifierEnum.ExternalId) {
                return `external-id/${this.value}`;
            }
            if (this.identifier === TaxonomyIdentifierEnum.Codename) {
                return `codename/${this.value}`;
            }
            throw Error(`Unsupported identifier '${this.identifier}'`);
        }
    }

    export class ContentTypeIdentifier {
        constructor(
            public identifier: ContentTypeIdentifierEnum,
            public value: string) {
        }

        getParamValue(): string {
            if (this.identifier === ContentTypeIdentifierEnum.Codename) {
                return `codename/${this.value}`;
            }
            if (this.identifier === ContentTypeIdentifierEnum.InternalId) {
                return `${this.value}`;
            }
            if (this.identifier === ContentTypeIdentifierEnum.ExternalId) {
                return `external-id/${this.value}`;
            }
            throw Error(`Unsupported identifier '${this.identifier}'`);
        }
    }

    export class WorkflowIdentifier {
        constructor(
            public identifier: WorkflowIdentifierEnum,
            public value: string) {
        }

        getParamValue(): string {
            if (this.identifier === WorkflowIdentifierEnum.Id) {
                return `${this.value}`;
            }
            throw Error(`Unsupported identifier '${this.identifier}'`);
        }
    }

    export class ContentItemIdentifier {
        constructor(
            public identifier: ContentItemIdentifierEnum,
            public value: string) {
        }

        getParamValue(): string {
            if (this.identifier === ContentItemIdentifierEnum.Codename) {
                return `codename/${this.value}`;
            }
            if (this.identifier === ContentItemIdentifierEnum.InternalId) {
                return `${this.value}`;
            }
            if (this.identifier === ContentItemIdentifierEnum.ExternalId) {
                return `external-id/${this.value}`;
            }
            throw Error(`Unsupported identifier '${this.identifier}'`);
        }
    }

    export class LanguageIdentifier {
        constructor(
            public identifier: LanguageIdentifierEnum,
            public value: string) {
        }

        getParamValue(): string {
            if (this.identifier === LanguageIdentifierEnum.Codename) {
                return `codename/${this.value}`;
            }

            if (this.identifier === LanguageIdentifierEnum.InternalId) {
                return `${this.value}`;
            }
            if (this.identifier === LanguageIdentifierEnum.ExternalId) {
                return `external-id/${this.value}`;
            }
            throw Error(`Unsupported identifier '${this.identifier}'`);
        }
    }

}

