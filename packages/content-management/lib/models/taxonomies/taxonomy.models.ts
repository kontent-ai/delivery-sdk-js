export namespace TaxonomyModels {

    export class Taxonomy {

        public lastModified!: Date;
        public name!: string;
        public id!: string;
        public codename!: string;
        public terms!: Taxonomy[];

        constructor(data: {
            lastModified: Date;
            name: string;
            id: string;
            codename: string;
            terms: Taxonomy[]
        }) {
            Object.assign(this, data);
        }
    }

    export interface IAddTaxonomyRequestModel {
        name: string;
        externalId?: string;
        terms: IAddTaxonomyRequestModel[];
    }
}
