export enum ImageFitModeEnum {
    Clip = 'clip',
    Scale = 'scale',
    Crop = 'crop'
}

export enum ImageFormatEnum {
    Gif = 'gif',
    Png = 'png',
    Png8 = 'png8',
    Jpg = 'jpg',
    Pjpg = 'pjpg',
    Webp = 'webp'
}

export enum ImageCompressionEnum {
    /**
     * Allows the original data to be perfectly reconstructed from the compressed data.
     */
    Lossless,
    /**
     * Irreversible compression where partial data are discarded.
     */
    Lossy
}
