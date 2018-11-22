export class TaxonomySystemAttributes {

    public id!: string;
    public name!: string;
    public codename!: string;
    public lastModified!: Date;

    constructor(
        data: {
            id: string,
            name: string,
            codename: string,
            lastModified: Date
        }
    ) {
        Object.assign(this, data);
    }
}
