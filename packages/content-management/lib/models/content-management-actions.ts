export class ContentManagementActions {

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
}

export const contentManagementActions = new ContentManagementActions();
