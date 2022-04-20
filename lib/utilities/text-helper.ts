export class TextHelper {
    getPropertyNameRegex(): RegExp {
        return /[-='"§!%:-_\s.]+(.)?/g;
    }
}

export const textHelper = new TextHelper();
