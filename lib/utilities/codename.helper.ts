export class CodenameHelper {
    /**
     * This is used to prevent errors caused by reserved names in content item codename (e.g. 'constructor')
     */
    escapeCodenameInCodenameIndexer(codename: string): string {
        return `_${codename}`;
    }
}

export const codenameHelper = new CodenameHelper();
