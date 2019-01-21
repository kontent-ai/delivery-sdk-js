import { ContentItemIdentifier } from './content-items/content-item-identifier';
import { LanguageIdentifier } from './language-variants/language-identifier';

class ContentManagementContentItemActions {

    validateProjectContent(): string {
        return `validate`;
    }

    listContentTypes(): string {
        return `types`;
    }

    viewContentTypeByInternalId(id: string): string {
        return `types/${id}`;
    }

    deleteContentTypeByCodename(codename: string): string {
        return `types/codename/${codename}`;
    }

    deleteContentTypeByInternalId(id: string): string {
        return `types/${id}`;
    }

    viewContentTypeByCodename(codename: string): string {
        return `types/codename/${codename}`;
    }

    addTaxonomy(): string {
        return `taxonomies`;
    }

    deleteTaxonomyByCodename(codename: string): string {
        return `taxonomies/codename/${codename}`;
    }

    deleteTaxonomyByInternalId(id: string): string {
        return `taxonomies/${id}`;
    }

    deleteTaxonomyByExternalId(id: string): string {
        return `taxonomies/external-id/${id}`;
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

    deleteAssetByCodename(codename: string): string {
        return `assets/codename/${codename}`;
    }

    deleteAssetByInternalId(id: string): string {
        return `assets/${id}`;
    }

    deleteAssetByExternalId(id: string): string {
        return `assets/external-id/${id}`;
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

    viewAssetByInternalId(id: string): string {
        return `assets/${id}`;
    }

    viewAssetByExternalId(id: string): string {
        return `assets/external-id/${id}`;
    }

    items(): string {
        return 'items';
    }

    viewContentItemByCodename(codename: string): string {
        return `items/codename/${codename}`;
    }

    viewContentItemByInternalId(id: string): string {
        return `items/${id}`;
    }

    viewContentItemByExternalId(id: string): string {
        return `items/external-id/${id}`;
    }

    addContentItem(): string {
        return `items`;
    }

    updateContentItemByCodename(codename: string): string {
        return `items/codename/${codename}`;
    }

    updateContentItemByInternalId(id: string): string {
        return `items/${id}`;
    }

    updateContentItemByExternalId(id: string): string {
        return `items/external-id/${id}`;
    }

    deleteContentItemByCodename(codename: string): string {
        return `items/codename/${codename}`;
    }

    deleteContentItemByInternalId(id: string): string {
        return `items/${id}`;
    }

    deleteContentItemByExternalId(id: string): string {
        return `items/external-id/${id}`;
    }

    listLanguageVariantsByCodename(codename: string): string {
        return `items/codename/${codename}/variants`;
    }

    listLanguageVariantsByInternalId(id: string): string {
        return `items/${id}/variants`;
    }

    listLanguageVariantsByExternalId(id: string): string {
        return `items/external-id/${id}/variants`;
    }

    upsertLanguageVariant(itemIdentifier: ContentItemIdentifier, itemIdentifierValue: string, langaugeIdentifier: LanguageIdentifier, languageIdentifierValue: string): string {
        let action = '';

        if (itemIdentifier === ContentItemIdentifier.Codename) {
            action += `items/codename/${itemIdentifierValue}/variants/`;
        } else if (itemIdentifier === ContentItemIdentifier.InternalId) {
            action += `items/${itemIdentifierValue}/variants/`;
        } else if (itemIdentifier === ContentItemIdentifier.ExternalId) {
            action += `items/external-id/${itemIdentifierValue}/variants/`;
        } else {
            throw Error(`Unsupported item identifier '${itemIdentifier}' for upsert language variant`);
        }

        if (langaugeIdentifier === LanguageIdentifier.Codename) {
            action += `codename/${languageIdentifierValue}`;
        } else if (langaugeIdentifier === LanguageIdentifier.InternalId) {
            action += `${languageIdentifierValue}`;
        } else {
            throw Error(`Unsupported language identifier '${LanguageIdentifier}' for upsert language variant`);
        }

        return action;
    }
}

export class ContentManagementActions {
    public contentItemActions: ContentManagementContentItemActions = new ContentManagementContentItemActions();
}

export const contentManagementActions = new ContentManagementActions();
