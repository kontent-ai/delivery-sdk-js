import { ILinkResolverResult } from '../interfaces';
import { ContentItem, Link } from '../models';

export class UrlSlugResolver {
  resolveUrl(data: {
    type: string;
    fieldValue: string;
    fieldName: string;
    item: ContentItem;
    linkResolver: ((link: Link) => string | undefined | ILinkResolverResult) | undefined;
    enableAdvancedLogging: boolean;
  }): string | ILinkResolverResult | undefined {
    if (!data.linkResolver) {
      if (data.enableAdvancedLogging) {
        console.warn(
          `You have to implement 'linkResolver' in your Model class or your query in order to get url of this item`
        );
      }
      return undefined;
    }

    if (!data.item) {
      if (data.enableAdvancedLogging) {
        console.warn(
          `Cannot resolve link for field '${
            data.fieldName
          }' because no item was provided to URL slug field (item may be missing from response)`
        );
      }
      return undefined;
    }

    const url = data.linkResolver(
      new Link({
        urlSlug: data.fieldValue,
        type: data.type,
        codename: data.item.system.codename,
        itemId: data.item.system.id
      })
    );

    if (!url) {
      if (data.enableAdvancedLogging) {
        console.warn(
          `'linkResolver' is configured, but url resolved for '${
            data.item.system.codename
          }' item of '${data.item.system.type}' type inside '${
            data.fieldName
          }' field resolved to an undefined url.`
        );
      }
      return undefined;
    }

    return url;
  }
}

export const urlSlugResolver = new UrlSlugResolver();
