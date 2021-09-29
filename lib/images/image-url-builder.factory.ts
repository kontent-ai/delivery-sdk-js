import { ImageUrlBuilder } from './image-url-builder';

export function createUrlBuilder(url: string): ImageUrlBuilder {
    return new ImageUrlBuilder(url);
}
