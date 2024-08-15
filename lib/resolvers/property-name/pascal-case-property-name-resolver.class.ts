import { textHelper } from '../../utilities';
import { PropertyNameResolver } from '../../models';

export const pascalCasePropertyNameResolver: PropertyNameResolver = (contentType, element) => {
    return textHelper.addUnderscoreWhenStarsWithNumber(textHelper.removeZeroWidthCharacters(toPascalCase(element)));
};

function toPascalCase(str: string): string {
    str = str.replace(textHelper.getPropertyNameRegex(), (_, c: string) => (c ? c.toUpperCase() : ''));
    return str.substring(0, 1).toUpperCase() + str.substring(1);
}
