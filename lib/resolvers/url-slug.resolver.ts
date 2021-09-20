import { IContentItem, ItemUrlSlugResolver, IUrlSlugResolverResult, Link } from '../models';

export class UrlSlugResolver {
    resolveUrl(data: {
        elementValue: string;
        elementName: string;
        item: IContentItem<any>;
        resolver: ItemUrlSlugResolver;
    }): IUrlSlugResolverResult {
        const url = data.resolver(
            new Link({
                urlSlug: data.elementValue,
                type: data.item.system.type,
                codename: data.item.system.codename,
                linkId: data.item.system.id
            }),
            {
                item: data.item,
                linkId: undefined, // available only for links in rich text elements,
                linkText: undefined // available only for links in rich text elements,
            }
        );

        if (!url) {
            console.warn(
                `'urlSlugResolver' is set, but url resolved for '${data.item.system.codename}' item of '${data.item.system.type}' type in element '${data.elementName}' is undefined. This warning can be turned off by disabling 'enableAdvancedLogging' option.`
            );
            return {
                html: '',
                url: ''
            };
        }

        return url;
    }
}

export const urlSlugResolver = new UrlSlugResolver();
