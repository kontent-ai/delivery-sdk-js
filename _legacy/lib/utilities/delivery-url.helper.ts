export class DeliveryUrlHelper {
    replaceAssetDomain(originalAssetUrl: string, customDomain: string): string {
        return `${customDomain}${this.getPathname(originalAssetUrl)}`;
    }

    getPathname(url: string): string {
        return new URL(url).pathname;
    }
}

export const deliveryUrlHelper = new DeliveryUrlHelper();
