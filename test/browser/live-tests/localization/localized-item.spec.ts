import { ItemResponses } from '../../../../lib';
import { Context, IMovieElements, setup } from '../../setup';

describe('Localized item', () => {
    const context = new Context();
    setup(context);

    const language: string = 'cz';
    const movieCodename: string = 'warrior';
    let response: ItemResponses.ViewContentItemResponse<IMovieElements>;

    beforeAll(async () => {
        response = (await context.deliveryClient.item<IMovieElements>(movieCodename).languageParameter(language).toPromise())
            .data;
    });

    it(`language should be '${language}'`, () => {
        expect(response.item.system.language).toEqual(language);
    });

    it(`title should be localized`, () => {
        expect(response.item.elements.title.value).toEqual('Warrior-cz');
    });
});
