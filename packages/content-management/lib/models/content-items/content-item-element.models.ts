export namespace ContentItemElements {

    export enum ContentElementTypeEnum {
        text = 'text',
        date = 'date'
    }

    export interface IContentItemElementDefinition {
        name: string;
        type: ContentElementTypeEnum;
        propertyName?: string;
    }

    export class TextElement {
        constructor(
            public text: string | undefined
        ) { }
    }

    export class DateElement {
        constructor(
            public date: Date | undefined
        ) { }
    }
}
