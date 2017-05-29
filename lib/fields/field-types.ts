import { FieldType } from './field-type';
import { IField } from '../interfaces/ifield.interface';
import { IItem } from '../interfaces/iitem.interface';
import { IAsset, IMultipleChoiceOption } from './field-interfaces';
import { AssetModel, MultipleChoiceOption } from './field-models';

export class TextField implements IField {

    public text: string;

    constructor(
        public name: string,
        public type: FieldType,
        public value: any
    ) {
        this.text = this.value;
    };
}

export class MultipleChoiceField implements IField {

    public options: MultipleChoiceOption[] = [];

    constructor(
        public name: string,
        public type: FieldType,
        public value: any
    ) {
        if (this.value) {
            if (Array.isArray(this.value)) {
                this.value.forEach(option => {
                    var optionTemp = option as IMultipleChoiceOption;
                    this.options.push(new MultipleChoiceOption(
                        optionTemp.name,
                        optionTemp.codename
                    ));
                });
            }
        }
    };
}

export class DateTimeField implements IField {

    public datetime: Date;

    constructor(
        public name: string,
        public type: FieldType,
        public value: any
    ) {
        this.datetime = new Date(value);
    };
}

export class RichTextField implements IField {

    public text: string;
    public items: IItem[] = [];

    constructor(
        public name: string,
        public type: FieldType,
        public value: any,
        public modularItems: IItem[] 
    ) {
        this.text = value;
        this.items = modularItems;
    };
}

export class NumberField implements IField {

    public number: number;

    constructor(
        public name: string,
        public type: FieldType,
        public value: any
    ) {
        this.number = value;
    };
}

export class AssetsField implements IField {

    public assets: AssetModel[] = [];

    constructor(
        public name: string,
        public type: FieldType,
        public value: any
    ) {
        if (this.value) {
            if (Array.isArray(this.value)) {
                this.value.forEach(asset => {
                    var assetTemp = asset as IAsset;
                    this.assets.push(new AssetModel(
                        assetTemp.name,
                        assetTemp.type,
                        assetTemp.size,
                        assetTemp.description,
                        assetTemp.url
                    ));
                });
            }
        }
    };
}
