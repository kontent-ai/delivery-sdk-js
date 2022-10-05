import { Responses } from '../../../../lib';
import { Context, setup } from '../../setup';

describe('Live element', () => {
    const context = new Context();
    setup(context);

    const typeCodename: string = 'movie';

    const multipleChoiceElementCodename: string = 'category';
    const taxonomyElementCodename: string = 'releasecategory';

    let multipleChoiceElementResponse: Responses.IViewContentTypeElementResponse;
    let taxonomyElementResponse: Responses.IViewContentTypeElementResponse;

    beforeAll(async () => {
        multipleChoiceElementResponse = (
            await context.deliveryClient.element(typeCodename, multipleChoiceElementCodename).toPromise()
        ).data;

        taxonomyElementResponse = (
            await context.deliveryClient.element(typeCodename, taxonomyElementCodename).toPromise()
        ).data;

    });

    it(`element responses should be defined`, () => {
        expect(multipleChoiceElementResponse).toBeDefined();
        expect(taxonomyElementResponse).toBeDefined();
    });

    it(`element inside responses should be defined`, () => {
        expect(multipleChoiceElementResponse.element).toBeDefined();
        expect(taxonomyElementResponse.element).toBeDefined();
    });

    it(`element taxonomy element should contain valid taxonomy group property`, () => {
        expect(taxonomyElementResponse.element.taxonomyGroup).toBeDefined();
        expect(taxonomyElementResponse.element.taxonomyGroup).toEqual(jasmine.any(String));
    });

    it(`multiple choice element should contain options`, () => {
        expect(multipleChoiceElementResponse.element.options).toBeDefined();
        expect(multipleChoiceElementResponse.element.options.length).toBeGreaterThan(0);
    });
});
