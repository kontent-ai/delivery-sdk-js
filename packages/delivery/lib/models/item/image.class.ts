export class RichTextImage {

    public imageId!: string;
    public url!: string;
    public description?: string;

    constructor(
        data: {
            imageId: string,
            url: string,
            description?: string
        }
    ) {
        Object.assign(this, data);
    }
}
