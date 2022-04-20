import { textHelper } from '../../utilities';
import { PropertyNameResolver } from '../../models';

export const snakeCasePropertyNameResolver: PropertyNameResolver = (contentType, element) => {
    return textHelper
        .addUnderscoreWhenStarsWithNumber(textHelper.removeZeroWidthCharacters(toSnakeCase(element)))
        .toLowerCase();
};

function toSnakeCase(str: string): string {
    str = str.replace(textHelper.getPropertyNameRegex(), (_, c) => '_' + (c ? c.toLowerCase() : ''));
    return removeEndUnderscore(removeStartUnderscore(str));
}

function removeStartUnderscore(str: string): string {
    if (!str.startsWith('_')) {
        return str;
    }

    return str.substring(1);
}

function removeEndUnderscore(str: string): string {
    if (!str.endsWith('_')) {
        return str;
    }

    return str.slice(0, -1);
}
