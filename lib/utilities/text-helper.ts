export class TextHelper {
    getPropertyNameRegex(): RegExp {
        return /[;,\/\&\(\)\?\-\=\'\"\\\xa7\!\%\:\_\s.]+(.)?/g;
    }

    removeZeroWidthCharacters(str: string): string {
        return str.replace(/[\u200B-\u200D\uFEFF]/g, '');
    }

    addUnderscoreWhenStarsWithNumber(str: string): string {
        if (this.startsWithNumber(str)) {
            return `_${str}`;
        }
        return str;
    }

    startsWithNumber(str: string): boolean {
        if (str.match(/^\d/)) {
            return true;
        }
        return false;
    }
}

export const textHelper = new TextHelper();
