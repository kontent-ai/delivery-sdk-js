import { Identifiers } from './identifiers';


class ContentManagementContentItemActions {

    changeWorkflowStepOfLanguageVariant(itemIdentifier: Identifiers.ContentItemIdentifier, languageIdentifier: Identifiers.LanguageIdentifier, workflowIdentifier: Identifiers.WorkflowIdentifier): string {
        return `items/${itemIdentifier.getParamValue()}/variants/${languageIdentifier.getParamValue()}/workflow/${workflowIdentifier.getParamValue()}`;
    }

    publishOrScheduleLaguageVariant(itemIdentifier: Identifiers.ContentItemIdentifier, languageIdentifier: Identifiers.LanguageIdentifier): string {
        return `items/${itemIdentifier.getParamValue()}/variants/${languageIdentifier.getParamValue()}/publish`;
    }

    listWorkflowSteps(): string {
        return `workflow`;
    }

    listContentTypeSnippets(): string {
        return `snippets`;
    }

    viewContentTypeSnippet(identifier: Identifiers.ContentItemIdentifier): string {
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

    deleteContentType(identifier: Identifiers.ContentItemIdentifier): string {
        return `types/${identifier.getParamValue()}`;
    }

    viewContentType(identifier: Identifiers.ContentItemIdentifier): string {
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

    deleteContentItem(identifier: Identifiers.ContentItemIdentifier): string {
        return `items/${identifier.getParamValue()}`;
    }

    listLanguageVariants(itemIdentifier: Identifiers.ContentItemIdentifier): string {
        return `items/${itemIdentifier.getParamValue()}/variants`;
    }

    viewOrUpsertLanguageVariant(itemIdentifier: Identifiers.ContentItemIdentifier, langaugeIdentifier: Identifiers.LanguageIdentifier): string {
        return `items/${itemIdentifier.getParamValue()}/variants/${langaugeIdentifier.getParamValue()}`;
    }
}

export class ContentManagementActions {
    public contentItemActions: ContentManagementContentItemActions = new ContentManagementContentItemActions();
}

export const contentManagementActions = new ContentManagementActions();
