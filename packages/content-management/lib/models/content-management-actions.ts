
class ContentManagementContentItemActions {
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
}

export class ContentManagementActions {
    public contentItemActions: ContentManagementContentItemActions = new ContentManagementContentItemActions();
}

export const contentManagementActions = new ContentManagementActions();
