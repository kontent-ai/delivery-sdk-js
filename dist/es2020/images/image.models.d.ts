export declare enum ImageFitModeEnum {
    Clip = "clip",
    Scale = "scale",
    Crop = "crop"
}
export declare enum ImageFormatEnum {
    Gif = "gif",
    Png = "png",
    Png8 = "png8",
    Jpg = "jpg",
    Pjpg = "pjpg",
    Webp = "webp"
}
export declare enum ImageCompressionEnum {
    /**
     * Allows the original data to be perfectly reconstructed from the compressed data.
     */
    Lossless = 0,
    /**
     * Irreversible compression where partial data are discarded.
     */
    Lossy = 1
}
