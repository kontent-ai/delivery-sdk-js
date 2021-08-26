import { IQueryParameter } from '@kentico/kontent-core';
import { ImageCompressionEnum, ImageFitModeEnum, ImageFormatEnum } from './image.models';
export declare class ImageUrlBuilder {
    /** Image url */
    imageUrl: string;
    private queryParams;
    private readonly automaticFormatValue;
    constructor(
    /** Image url */
    imageUrl: string);
    /**
     * Used to add custom parameters to existing query string
     * @param param Parameter (may or may not include value)
     */
    withCustomParam(param: string): this;
    /**
     * The dpr transformation is used to serve correctly sized images for devices that expose a device pixel ratio.
     * @param dpr A required DPR value.
     */
    withDpr(dpr: number): this;
    /**
     * Applies the crop transformation that removes pixels from an image outside the specified rectangle.
     * @param x Rectangle offset on the X-axis.
     * @param y Rectangle offset on the Y-axis.
     * @param width Rectangle width.
     * @param height Rectangle height.
     */
    withRectangleCrop(x: number, y: number, width: number, height: number): this;
    /**
     * Applies the crop transformation centered on the specified point.
     * @param x Focal point X coordinate.
     * @param y Focal point Y coordinate.
     * @param z Zoom of the transformation.
     */
    withFocalPointCrop(x: number, y: number, z: number): this;
    /**
     * Enables WebP image support.
     * @param compression Specifies the lossy or lossless compression.
     */
    withAutomaticFormat(backupFormat?: ImageFormatEnum): this;
    /**
     * The fit transformation controls how the output image is fit to its target dimensions after resizing.
     * @param fitMode Specifies the mode for the transformation.
     */
    withFitMode(fitMode: ImageFitModeEnum): this;
    /**
     * Specifies the compression mode for the WebP image transformations.
     * @param compression Specifies the lossy or lossless compression.
     */
    withCompression(compression: ImageCompressionEnum): this;
    /**
     * Applies the quality parameter that enables control over the compression level for lossy file-formatted images.
     * @param quality The required quality of the image.
     */
    withQuality(quality: number): this;
    /**
     * The format transformation enables the source image to be converted (a.k.a., "transcoded") from
     * one encoded format to another. This is very useful when the source image has been saved in a sub-optimal
     * file format that hinders performance.
     * @param format Target image file type.
     */
    withFormat(format: ImageFormatEnum): this;
    /**
     * The height transformation enables dynamic height resizing based on pixels and percent values.
     * @param height A required image height.
     */
    withHeight(height: number): this;
    /**
     * The width transformation enables dynamic width resizing based on pixels and percent values.
     * @param width A required image width.
     */
    withWidth(width: number): this;
    /**
     * Gets params applied to image
     */
    getParams(): IQueryParameter[];
    /**
     * Gets query string part of the image URL
     */
    getQueryString(): string;
    /**
     * Gets full transformed url to image with parameters
     */
    getUrl(): string;
}
