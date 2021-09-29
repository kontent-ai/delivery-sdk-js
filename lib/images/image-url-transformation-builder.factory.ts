import { ImageUrlTransformationBuilder } from './image-url-transformation-builder';

export function createImageTransformationUrlBuilder(url: string): ImageUrlTransformationBuilder {
    return new ImageUrlTransformationBuilder(url);
}
