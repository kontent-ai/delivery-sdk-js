import { FieldType } from '../fields/field-type';
export interface IField {
    name: string;
    type: FieldType;
    value: any;
    modular_content?: string[];
}
