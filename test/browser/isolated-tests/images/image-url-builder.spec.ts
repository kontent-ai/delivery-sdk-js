import {
    ImageFormatEnum,
    ImageCompressionEnum,
    ImageFitModeEnum,
    createUrlBuilder
} from '../../../../lib';

describe('Image URL builder', () => {
    const getImageBuilder = () => createUrlBuilder('myimage.jpg');

    it(`Checks complex query`, () => {
        const ib = getImageBuilder();
        ib
            .withDpr(2)
            .withCompression(ImageCompressionEnum.Lossless)
            .withQuality(4)
            .withHeight(200)
            .withWidth(100);

        expect(ib.getUrl()).toContain('myimage.jpg');
        expect(ib.getUrl()).toContain('q=4');
        expect(ib.getUrl()).toContain('w=100');
        expect(ib.getUrl()).toContain('h=200');
        expect(ib.getUrl()).toContain('lossless=true');
        expect(ib.getUrl()).toContain('dpr=2');
    });

    it(`Checks automatic format`, () => {
        const ib = getImageBuilder();
        ib.withAutomaticFormat();
        expect(ib.getUrl()).toContain('auto=format');
    });

    it(`Checks automatic format with backup`, () => {
        const ib = getImageBuilder();
        ib.withAutomaticFormat(ImageFormatEnum.Jpg);
        expect(ib.getUrl()).toContain('fm=jpg');
        expect(ib.getUrl()).toContain('auto=format');
    });

    it(`Checks dpr`, () => {
        const ib = getImageBuilder();
        ib.withDpr(9);
        expect(ib.getUrl()).toContain('dpr=9');
    });

    it(`Checks width`, () => {
        const ib = getImageBuilder();
        ib.withWidth(250);
        expect(ib.getUrl()).toContain('w=250');

        ib.withWidth(0.5);
        expect(ib.getUrl()).toContain('w=0.5');

        ib.withWidth(97.012345678915);
        expect(ib.getUrl()).toContain('w=97.012345678915');
    });

    it(`Checks height`, () => {
        const ib = getImageBuilder();
        ib.withHeight(100);
        expect(ib.getUrl()).toContain('h=100');
    });

    it(`Checks quality`, () => {
        const ib = getImageBuilder();
        ib.withQuality(2);
        expect(ib.getUrl()).toContain('q=2');
    });

    it(`Checks format`, () => {
        const ib = getImageBuilder();
        ib.withFormat(ImageFormatEnum.Png);
        expect(ib.getUrl()).toContain('fm=png');

        ib.withFormat(ImageFormatEnum.Png8);
        expect(ib.getUrl()).toContain('fm=png8');
    });

    it(`Checks compression`, () => {
        const ib = getImageBuilder();
        ib.withCompression(ImageCompressionEnum.Lossless);
        expect(ib.getUrl()).toContain('lossless=true');

        ib.withCompression(ImageCompressionEnum.Lossy);
        expect(ib.getUrl()).toContain('lossless=false');
    });

    it(`Checks rectangle crop`, () => {
        const ib = getImageBuilder();
        ib.withRectangleCrop(1, 2, 50, 90);
        expect(ib.getUrl()).toContain('rect=1,2,50,90');
    });

    it(`Checks focal point crop`, () => {
        const ib = getImageBuilder();
        ib.withFocalPointCrop(2, 50, 3);
        expect(ib.getUrl()).toContain('crop=focalpoint');
        expect(ib.getUrl()).toContain('fp-x=2');
        expect(ib.getUrl()).toContain('fp-y=50');
        expect(ib.getUrl()).toContain('fp-z=3');
    });

    it(`Checks fit mode`, () => {
        const ib = getImageBuilder();
        ib.withFitMode(ImageFitModeEnum.Crop);
        expect(ib.getUrl()).toContain('fit=crop');

        ib.withFitMode(ImageFitModeEnum.Clip);
        expect(ib.getUrl()).toContain('fit=clip');

        ib.withFitMode(ImageFitModeEnum.Scale);
        expect(ib.getUrl()).toContain('fit=scale');
    });

    it(`Checks custom param`, () => {
        const ib = getImageBuilder();
        ib.withCustomParam('x=y');
        expect(ib.getUrl()).toContain('x=y');
    });
});
