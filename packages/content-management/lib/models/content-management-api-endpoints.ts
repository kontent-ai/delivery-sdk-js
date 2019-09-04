import { Identifiers } from './identifiers';


export class ContentManagementApiEndpoints {

    changeWorkflowStepOfLanguageVariant(itemIdentifier: Identifiers.ContentItemIdentifier, languageIdentifier: Identifiers.LanguageIdentifier, workflowIdentifier: Identifiers.WorkflowIdentifier): string {
        return `items/${itemIdentifier.getParamValue()}/variants/${languageIdentifier.getParamValue()}/workflow/${workflowIdentifier.getParamValue()}`;
    }

    publishOrScheduleLaguageVariant(itemIdentifier: Identifiers.ContentItemIdentifier, languageIdentifier: Identifiers.LanguageIdentifier): string {
        return `items/${itemIdentifier.getParamValue()}/variants/${languageIdentifier.getParamValue()}/publish`;
    }

    createNewVersionOfALanguageVariant(itemIdentifier: Identifiers.ContentItemIdentifier, languageIdentifier: Identifiers.LanguageIdentifier): string {
        return `items/${itemIdentifier.getParamValue()}/variants/${languageIdentifier.getParamValue()}/new-version`;
    }

    unpublishLanguageVariant(itemIdentifier: Identifiers.ContentItemIdentifier, languageIdentifier: Identifiers.LanguageIdentifier): string {
        return `items/${itemIdentifier.getParamValue()}/variants/${languageIdentifier.getParamValue()}/unpublish`;
    }

    cancelScheduledPublishingOfLanguageVariant(itemIdentifier: Identifiers.ContentItemIdentifier, languageIdentifier: Identifiers.LanguageIdentifier): string {
        return `items/${itemIdentifier.getParamValue()}/variants/${languageIdentifier.getParamValue()}/cancel-scheduled-publish`;
    }

    listWorkflowSteps(): string {
        return `workflow`;
    }

    listContentTypeSnippets(): string {
        return `snippets`;
    }

    viewContentTypeSnippet(identifier: Identifiers.ContentTypeIdentifier): string {
        return `snippets/${identifier.getParamValue()}`;
    }

    addContentTypeSnippet(): string {
        return `snippets`;
    }

    deleteContentTypeSnippet(identifier: Identifiers.ContentTypeIdentifier): string {
        return `snippets/${identifier.getParamValue()}`;
    }

    validateProjectContent(): string {
        return `validate`;
    }

    listContentTypes(): string {
        return `types`;
    }

    addContentType(): string {
        return `types`;
    }

    deleteContentType(identifier: Identifiers.ContentTypeIdentifier): string {
        return `types/${identifier.getParamValue()}`;
    }

    viewContentType(identifier: Identifiers.ContentTypeIdentifier): string {
        return `types/${identifier.getParamValue()}`;
    }

    addTaxonomy(): string {
        return `taxonomies`;
    }

    deleteTaxonomy(identifier: Identifiers.TaxonomyIdentifier): string {
        return `taxonomies/${identifier.getParamValue()}`;
    }

    listTaxonomies(): string {
        return `taxonomies`;
    }

    addAsset(): string {
        return `assets`;
    }

    updateAsset(assetId: string): string {
        return `assets/${assetId}`;
    }

    deleteAsset(identifier: Identifiers.AssetIdentifier): string {
        return `assets/${identifier.getParamValue()}`;
    }

    upsertAsset(assetExternalId: string): string {
        return `assets/external-id/${assetExternalId}`;
    }

    uploadBinaryFile(filename: string): string {
        return `files/${filename}`;
    }

    listAssets(): string {
        return 'assets';
    }

    viewAsset(identifier: Identifiers.AssetIdentifier): string {
        return `assets/${identifier.getParamValue()}`;
    }

    items(): string {
        return 'items';
    }

    viewContentItem(identifier: Identifiers.ContentItemIdentifier): string {
        return `items/${identifier.getParamValue()}`;
    }

    addContentItem(): string {
        return `items`;
    }

    updateContentItem(identifier: Identifiers.ContentItemIdentifier): string {
        return `items/${identifier.getParamValue()}`;
    }

    upsertContentItem(identifier: Identifiers.ContentItemIdentifier): string {
        return `items/${identifier.getParamValue()}`;
    }

    deleteContentItem(identifier: Identifiers.ContentItemIdentifier): string {
        return `items/${identifier.getParamValue()}`;
    }

    listLanguageVariantsOfItem(identifier: Identifiers.ContentItemIdentifier): string {
        return `items/${identifier.getParamValue()}/variants`;
    }

    listLanguageVariantsOfContentType(identifier: Identifiers.ContentTypeIdentifier): string {
        return `types/${identifier.getParamValue()}/variants`;
    }

    viewOrUpsertLanguageVariant(itemIdentifier: Identifiers.ContentItemIdentifier, langaugeIdentifier: Identifiers.LanguageIdentifier): string {
        return `items/${itemIdentifier.getParamValue()}/variants/${langaugeIdentifier.getParamValue()}`;
    }

    viewLanguage(identifier: Identifiers.LanguageIdentifier): string {
        return `languages/${identifier.getParamValue()}`;
    }

    addLanguage(): string {
        return `languages`;
    }

    modifyLanguage(identifier: Identifiers.LanguageIdentifier): string {
        return `languages/${identifier.getParamValue()}`;
    }

    listLanguages(): string {
        return `languages`;
    }
}

export const contentManagementApiEndpoints = new ContentManagementApiEndpoints();
