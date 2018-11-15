export class ReferenceModel {

    public id?: string;
    public codename?: string;
    public externalId?: string;

    constructor(data: {
        id?: string;
        codename?: string;
        externalId?: string;
    }) {
        Object.assign(this, data);
    }
}
