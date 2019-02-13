
export class Link {

    /**
     * Id of the link
     */
    public linkId!: string;

    /**
     * Codename of the content item
     */
    public codename!: string;

    /**
     * Type codename of the content item
     */
    public type!: string;

    /**
     * Url slug defined for the content item
     */
    public urlSlug!: string;

    constructor(
        data: {
            linkId: string;
            codename: string,
            type: string,
            urlSlug: string,
        }
    ) {
        Object.assign(this, data);
    }
}
