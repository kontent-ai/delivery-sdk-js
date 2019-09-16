import { SharedModels } from '../shared/shared-models';

export namespace ElementModels {

    export enum ElementMode {
        single = 'single',
        multiple = 'multiple'
    }

    export enum ElementType {
        text = 'text',
        richText = 'rich_text',
        number = 'number',
        multipleChoice = 'multiple_choice',
        dateTime = 'date_time',
        asset = 'asset',
        modularContent = 'modular_content',
        taxonomy = 'taxonomy',
        urlSlug = 'url_slug',
        guidelines = 'guidelines',
        snippet = 'snippet',
        custom = 'custom'
    }

    export class ContentItemElement {
        public element!: SharedModels.ReferenceObject;
        public value!: string | number | SharedModels.ReferenceObject[];

        constructor(
            data: {
                element: SharedModels.ReferenceObject;
                value: string | number | SharedModels.ReferenceObject[];
            }
        ) {
            Object.assign(this, data);
        }
    }

    export class MultipleChoiceElementOption {
        public id!: string;
        public name!: string;
        public codename!: string;

        constructor(data: {
            id: string,
            name: string,
            codename: string,
        }) {
            Object.assign(this, data);
        }
    }

    export class ElementModel {

        public id!: string;
        public name?: string;
        public codename!: string;
        public type!: ElementType;
        public guidelines!: string;

        constructor(data: {
            id: string,
            name?: string,
            codename: string,
            type: ElementType,
            guidelines: string
        }) {
            Object.assign(this, data);
        }
    }

    export class MultipleChoiceElementModel extends ElementModel {

        public options!: MultipleChoiceElementOption[];
        public mode!: ElementMode;

        constructor(data: ElementModel, multipleElemData: {
            options: MultipleChoiceElementOption[];
            mode: ElementMode;
        }) {
            super(data);

            this.options = multipleElemData.options;
            this.mode = multipleElemData.mode;
        }
    }

    export interface IElementData {
        id: string;
        name?: string;
        codename: string;
        type: ElementType;
        guidelines: string;
    }

    export interface IMultipleChoiceOptionData {
        name: string;
    }

    export interface IMultipleChoiceElementData extends IElementData {
        options: IMultipleChoiceOptionData[];
        mode: ElementMode;
    }

}
