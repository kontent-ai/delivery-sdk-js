export class TaxonomyTerms {

    public name!: string;
    public codename!: string;
    public terms!: TaxonomyTerms[];

    constructor(
        data: {
            name: string,
            codename: string,
            terms: TaxonomyTerms[]
        }
    ) {
        Object.assign(this, data);
    }
}
