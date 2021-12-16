import * as urlParse from 'url-parse';

export class DeliveryUrlHelper {
    replaceAssetDomain(originalAssetUrl: string, customDomain: string): string {
        const urlPath = this.getUrlPathname(originalAssetUrl);

        return `${customDomain}${urlPath}`;
    }

    getUrlPathname(url: string): string {
        const parsedUrl = urlParse(url);

        return parsedUrl.pathname;
    }
}

export const deliveryUrlHelper = new DeliveryUrlHelper();
