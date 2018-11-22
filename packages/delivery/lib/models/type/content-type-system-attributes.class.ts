
export class ContentTypeSystemAttributes {

    /**
    * Id of the type
    */
    public id!: string;

    /**
     * Name of the type
     */
    public name!: string;

    /**
     * Codename of the type
     */
    public codename!: string;

    /**
     * Date of last modification
     */
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

