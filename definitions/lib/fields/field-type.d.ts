export declare class FieldType {
    type: string;
    constructor(type: string);
    toString(): string;
    static text: FieldType;
    static number: FieldType;
    static modular_content: FieldType;
    static asset: FieldType;
    static datetime: FieldType;
    static rich_text: FieldType;
    static multiple_choice: FieldType;
}
