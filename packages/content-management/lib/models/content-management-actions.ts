
class ContentManagementContentItemActions {

    addAsset(): string {
        return `assets`;
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
}

export class ContentManagementActions {
    public contentItemActions: ContentManagementContentItemActions = new ContentManagementContentItemActions();
}

export const contentManagementActions = new ContentManagementActions();
