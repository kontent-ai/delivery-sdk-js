export var ImageFitModeEnum;
(function (ImageFitModeEnum) {
    ImageFitModeEnum["Clip"] = "clip";
    ImageFitModeEnum["Scale"] = "scale";
    ImageFitModeEnum["Crop"] = "crop";
})(ImageFitModeEnum || (ImageFitModeEnum = {}));
export var ImageFormatEnum;
(function (ImageFormatEnum) {
    ImageFormatEnum["Gif"] = "gif";
    ImageFormatEnum["Png"] = "png";
    ImageFormatEnum["Png8"] = "png8";
    ImageFormatEnum["Jpg"] = "jpg";
    ImageFormatEnum["Pjpg"] = "pjpg";
    ImageFormatEnum["Webp"] = "webp";
})(ImageFormatEnum || (ImageFormatEnum = {}));
export var ImageCompressionEnum;
(function (ImageCompressionEnum) {
    /**
     * Allows the original data to be perfectly reconstructed from the compressed data.
     */
    ImageCompressionEnum[ImageCompressionEnum["Lossless"] = 0] = "Lossless";
    /**
     * Irreversible compression where partial data are discarded.
     */
    ImageCompressionEnum[ImageCompressionEnum["Lossy"] = 1] = "Lossy";
})(ImageCompressionEnum || (ImageCompressionEnum = {}));
//# sourceMappingURL=image.models.js.map