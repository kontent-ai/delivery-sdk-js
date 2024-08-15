import { textHelper } from '../../utilities';
import { PropertyNameResolver } from '../../models';

export const camelCasePropertyNameResolver: PropertyNameResolver = (contentType, element) => {
    return textHelper.addUnderscoreWhenStarsWithNumber(textHelper.removeZeroWidthCharacters(toCamelCase(element)));
};

function toCamelCase(str: string): string {
    str = str.replace(textHelper.getPropertyNameRegex(), (_, c: string) => (c ? c.toUpperCase() : ''));
    return str.substring(0, 1).toLowerCase() + str.substring(1);
}
