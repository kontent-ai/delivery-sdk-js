import { FieldType } from './field-type';
import { IField } from '../interfaces/ifield.interface';
import { IItem } from '../interfaces/iitem.interface';
import { AssetModel, MultipleChoiceOption } from './field-models';
export declare class TextField implements IField {
    name: string;
    type: FieldType;
    value: any;
    text: string;
    constructor(name: string, type: FieldType, value: any);
}
export declare class MultipleChoiceField implements IField {
    name: string;
    type: FieldType;
    value: any;
    options: MultipleChoiceOption[];
    constructor(name: string, type: FieldType, value: any);
}
export declare class DateTimeField implements IField {
    name: string;
    type: FieldType;
    value: any;
    datetime: Date;
    constructor(name: string, type: FieldType, value: any);
}
export declare class RichTextField implements IField {
    name: string;
    type: FieldType;
    value: any;
    modularItems: IItem[];
    text: string;
    items: IItem[];
    constructor(name: string, type: FieldType, value: any, modularItems: IItem[]);
}
export declare class NumberField implements IField {
    name: string;
    type: FieldType;
    value: any;
    number: number;
    constructor(name: string, type: FieldType, value: any);
}
export declare class AssetsField implements IField {
    name: string;
    type: FieldType;
    value: any;
    assets: AssetModel[];
    constructor(name: string, type: FieldType, value: any);
}
