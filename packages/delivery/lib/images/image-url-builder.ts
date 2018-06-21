import { IQueryParameter } from '../interfaces';
import { Parameters } from '../models';
import {
  ImageCompressionEnum,
  ImageFormatEnum,
  ImageFitModeEnum
} from './image.models';

export class ImageUrlBuilder {
  private queryParams: IQueryParameter[] = [];

  constructor(
    /** Image url */
    public imageUrl: string
  ) {}

  /**
   * The dpr transformation is used to serve correctly sized images for devices that expose a device pixel ratio.
   * @param dpr A required DPR value.
   */
  withDpr(dpr: number): this {
    this.queryParams.push(
      new Parameters.QueryParameter('dpr', dpr.toString())
    );

    return this;
  }

  /**
   * Applies the crop transformation that removes pixels from an image outside the specified rectangle.
   * @param x Rectangle offset on the X-axis.
   * @param y Rectangle offset on the Y-axis.
   * @param width Rectangle width.
   * @param height Rectangle height.
   */
  withRectangleCrop(x: number, y: number, width: number, height: number): this {
    this.queryParams.push(
      new Parameters.QueryParameter('rect', [x, y, width, height].join(','))
    );
    return this;
  }

  /**
   * Applies the crop transformation centered on the specified point.
   * @param x Focal point X coordinate.
   * @param y Focal point Y coordinate.
   * @param z Zoom of the transformation.
   */
  withFocalPointCrop(x: number, y: number, z: number): this {
    this.withFitMode(ImageFitModeEnum.Crop);

    this.queryParams.push(new Parameters.QueryParameter('crop', 'focalpoint'));
    this.queryParams.push(new Parameters.QueryParameter('fp-x', x.toString()));
    this.queryParams.push(new Parameters.QueryParameter('fp-y', y.toString()));
    this.queryParams.push(new Parameters.QueryParameter('fp-z', z.toString()));

    return this;
  }

  /**
   * Enables WebP image support.
   * @param compression Specifies the lossy or lossless compression.
   */
  withAutomaticFormat(backupFormat?: ImageFormatEnum): this {
    this.queryParams.push(
      new Parameters.QueryParameter('auto', ImageFormatEnum.Webp)
    );

    if (backupFormat) {
      this.withFormat(backupFormat);
    }

    return this;
  }

  /**
   * The fit transformation controls how the output image is fit to its target dimensions after resizing.
   * @param fitMode Specifies the mode for the transformation.
   */
  withFitMode(fitMode: ImageFitModeEnum): this {
    this.queryParams.push(new Parameters.QueryParameter('fit', fitMode));
    return this;
  }

  /**
   * Specifies the compression mode for the WebP image transformations.
   * @param compression Specifies the lossy or lossless compression.
   */
  withCompression(compression: ImageCompressionEnum): this {
    this.queryParams.push(
      new Parameters.QueryParameter(
        'lossless',
        compression === ImageCompressionEnum.Lossless ? 'true' : 'false'
      )
    );
    return this;
  }

  /**
   * Applies the quality parameter that enables control over the compression level for lossy file-formatted images.
   * @param quality The required quality of the image.
   */
  withQuality(quality: number): this {
    this.queryParams.push(
      new Parameters.QueryParameter('q', quality.toString())
    );
    return this;
  }

  /**
   * The format transformation enables the source image to be converted (a.k.a., "transcoded") from
   * one encoded format to another. This is very useful when the source image has been saved in a sub-optimal
   * file format that hinders performance.
   * @param format Target image file type.
   */
  withFormat(format: ImageFormatEnum): this {
    this.queryParams.push(
      new Parameters.QueryParameter('fm', format)
    );
    return this;
  }

  /**
   * The height transformation enables dynamic height resizing based on pixels and percent values.
   * @param height A required image height.
   */
  withHeight(height: number): this {
    this.queryParams.push(
      new Parameters.QueryParameter('h', height.toString())
    );
    return this;
  }

  /**
   * The width transformation enables dynamic width resizing based on pixels and percent values.
   * @param width A required image width.
   */
  withWidth(width: number): this {
    this.queryParams.push(new Parameters.QueryParameter('w', width.toString()));
    return this;
  }

  /**
   * Gets params applied to image
   */
  getParams(): IQueryParameter[] {
    return this.queryParams;
  }

  /**
   * Gets query string part of the image URL
   */
  getQueryString(): string {
    let query: string = '';
    this.queryParams.forEach(filter => {
      if (query.indexOf('?') > -1) {
        query = query + '&' + filter.getParam() + '=' + filter.getParamValue();
      } else {
        query = query + '?' + filter.getParam() + '=' + filter.getParamValue();
      }
    });

    return query;
  }

  /**
   * Gets full transformed url to image with parameters
   */
  getUrl(): string {
    return this.imageUrl + this.getQueryString();
  }
}
