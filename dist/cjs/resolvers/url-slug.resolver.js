"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlSlugResolver = exports.UrlSlugResolver = void 0;
const models_1 = require("../models");
class UrlSlugResolver {
    resolveUrl(data) {
        const url = data.resolver(new models_1.Link({
            urlSlug: data.elementValue,
            type: data.item.system.type,
            codename: data.item.system.codename,
            linkId: data.item.system.id,
        }), {
            item: data.item,
            linkId: undefined,
            linkText: undefined // available only for links in rich text elements,
        });
        if (!url) {
            if (data.enableAdvancedLogging) {
                console.warn(`'urlSlugResolver' is set, but url resolved for '${data.item.system.codename}' item of '${data.item.system.type}' type in element '${data.elementName}' is undefined. This warning can be turned off by disabling 'enableAdvancedLogging' option.`);
            }
            return {
                html: '',
                url: ''
            };
        }
        return url;
    }
}
exports.UrlSlugResolver = UrlSlugResolver;
exports.urlSlugResolver = new UrlSlugResolver();
//# sourceMappingURL=url-slug.resolver.js.map