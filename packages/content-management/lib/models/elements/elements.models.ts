import { SharedModels } from '../shared/shared-models';

export namespace ElementModels {

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

    export class ContentTypeElementModel {

        public id!: string;
        public name!: string;
        public codename!: string;
        public type!: string;
        public guidelines!: string;

        constructor(data: {
            id: string,
            name: string,
            codename: string,
            type: string,
            guidelines: string
        }) {
            Object.assign(this, data);
        }
    }
}
