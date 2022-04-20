export class TextHelper {
    getPropertyNameRegex(): RegExp {
        return /[\?\-\=\'\"\§\!\%\:\_\s.]+(.)?/g;
    }

    removeZeroWidthCharacters(str: string): string {
        return str.replace(/[\u200B-\u200D\uFEFF]/g, '');
    }
}

export const textHelper = new TextHelper();
