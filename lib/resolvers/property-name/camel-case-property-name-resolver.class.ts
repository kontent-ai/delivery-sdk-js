import { textHelper } from '../../utilities';
import { PropertyNameResolver } from '../../models';

export const camelCasePropertyNameResolver: PropertyNameResolver = (contentType, element) => {
    return textHelper.addUnderscoreWhenStarsWithNumber(textHelper.removeZeroWidthCharacters(camelize(element)));
};

function camelize(str: string): string {
    str = str.replace(textHelper.getPropertyNameRegex(), (_, c) => (c ? c.toUpperCase() : ''));
    return str.substring(0, 1).toLowerCase() + str.substring(1);
}
