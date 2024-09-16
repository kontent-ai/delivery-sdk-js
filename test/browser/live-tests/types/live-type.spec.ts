import { IGenericElement, Responses } from '../../../../lib';
import { Context, setup } from '../../setup';

describe('Live type', () => {
    const context = new Context();
    setup(context);

    const codename: string = 'movie';
    let response: Responses.IViewContentTypeResponse;

    const multipleChoiceElement: string = 'category';
    const taxonomyElement: string = 'releasecategory';

    beforeAll(async () => {
        response = (await context.deliveryClient.type(codename).toPromise()).data;
    });

    it(`type should be defined`, () => {
        expect(response).toBeDefined();
    });

    it(`elements should be defined`, () => {
        expect(response.type.elements).toBeDefined();
    });

    it(`system properties should be defined`, () => {
        expect(response.type.system).toBeDefined();
    });

    it(`proper type should be returned based on test config`, () => {
        expect(response.type.system.codename).toEqual(codename);
    });

    it(`Verifies taxonomy element - '${taxonomyElement}'`, () => {
        const releasecategoryElement = response.type.elements.find(
            (m) => m.codename === taxonomyElement
        ) as IGenericElement;
        expect(releasecategoryElement).toBeDefined();
        expect(releasecategoryElement.taxonomyGroup).toBeDefined();
        expect(releasecategoryElement.taxonomyGroup).toEqual('releasecategory');
    });

    it(`Verifies multiple_choice element - '${multipleChoiceElement}'`, () => {
        const categoryElement = response.type.elements.find(
            (m) => m.codename === multipleChoiceElement
        ) as IGenericElement;

        expect(categoryElement).toBeDefined();
        expect(categoryElement.options).toBeDefined();
        expect(categoryElement.options.length).toBeGreaterThan(0);
        expect(categoryElement.options[0].codename).toBeDefined();
        expect(categoryElement.options[0].name).toBeDefined();
    });
});
