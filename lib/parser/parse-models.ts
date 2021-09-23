import { ContentItemType } from '../models';

/**
 * This class as a wrapper is required so we can pass
 * index as a reference and not a value
 */
 export class RichTextItemIndexReferenceWrapper {
    constructor(public index: number) {}

    increment(): void {
        this.index++;
    }
}

export interface IFeaturedObjects {
    links: ILinkObject[];
    linkedItems: ILinkedItemContentObject[];
    images: IImageObject[];
}


export interface ILinkedItemContentObject {
    dataType: string;
    dataCodename: string;
    itemType: ContentItemType;
}

export interface ILinkObject {
    dataItemId: string;
}

export interface IImageObject {
    imageId: string;
}




