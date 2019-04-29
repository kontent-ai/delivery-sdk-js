export class RichTextImage {

    public imageId!: string;
    public url!: string;
    public description?: string;
    public width?: number;
    public height?: number;

    constructor(
        data: {
            imageId: string,
            url: string,
            description?: string,
            height?: number;
            width?: number;
        }
    ) {
        Object.assign(this, data);
    }
}
