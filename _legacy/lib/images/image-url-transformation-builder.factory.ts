import { ImageUrlTransformationBuilder } from './image-url-transformation-builder';

export function transformImageUrl(url: string): ImageUrlTransformationBuilder {
    return new ImageUrlTransformationBuilder(url);
}
