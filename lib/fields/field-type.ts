export class FieldType {
    constructor(public type: string) {
    }

    toString() {
        return this.type;
    }

    static text = new FieldType("text");
    static number = new FieldType("number");
    static modular_content = new FieldType("modular_content");
    static asset = new FieldType("asset");
    static datetime = new FieldType("date_time");
    static rich_text = new FieldType("rich_text");
    static multiple_choice = new FieldType("multiple_choice");
}