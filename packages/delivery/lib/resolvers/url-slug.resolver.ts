import { IContentItem, ILinkResolverResult, ItemLinkResolver, Link } from '../models';

export class UrlSlugResolver {
  resolveUrl(data: {
    elementValue: string;
    elementName: string;
    item: IContentItem;
    linkResolver: ItemLinkResolver | undefined;
    enableAdvancedLogging: boolean;
  }): string | ILinkResolverResult | undefined {
    if (!data.linkResolver) {
      if (data.enableAdvancedLogging) {
        console.warn(
          `You have to implement 'linkResolver' in your Model class or your query in order to get url of this item. This warning can be turned off by disabling 'enableAdvancedLogging' option.`
        );
      }
      return undefined;
    }

    if (!data.item) {
      if (data.enableAdvancedLogging) {
        console.warn(
          `Cannot resolve link for element '${
          data.elementName
          }' because no item was provided to URL slug element (item may be missing from response). This warning can be turned off by disabling 'enableAdvancedLogging' option.`
        );
      }
      return undefined;
    }

    const url = data.linkResolver(
      new Link({
        urlSlug: data.elementValue,
        type: data.item.system.type,
        codename: data.item.system.codename,
        linkId: data.item.system.id,
      }), {
        linkText: undefined // link text is available only for links inside rich text element
      }
    );

    if (!url) {
      if (data.enableAdvancedLogging) {
        console.warn(
          `'linkResolver' is configured, but url resolved for '${
          data.item.system.codename
          }' item of '${data.item.system.type}' type inside '${
          data.elementName
          }' element resolved to an undefined url. This warning can be turned off by disabling 'enableAdvancedLogging' option.`
        );
      }
      return undefined;
    }

    return url;
  }
}

export const urlSlugResolver = new UrlSlugResolver();
