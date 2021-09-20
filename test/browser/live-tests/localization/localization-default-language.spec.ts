import { Context, IMovieElements, setup } from '../../setup';

describe('Language #1', () => {
    const language = 'en';
    const context = new Context();
    context.defaultLanguage = language;
    setup(context);

    const movieCodename: string = 'warrior';

    const query = context.deliveryClient.item<IMovieElements>(movieCodename).languageParameter(language);
    const queryLanguageParam = query.getParameters().find((m) => m.getParam() === `language=${language}`);

    it(`Language should be '${language}'`, () => {
        expect(queryLanguageParam).toBeDefined();
    });
});

describe('Language #2', () => {
    const language = 'cz';
    const context = new Context();
    context.defaultLanguage = language;
    setup(context);

    const newMovieCodename: string = 'warrior';

    const query = context.deliveryClient.item<IMovieElements>(newMovieCodename).languageParameter(language);
    const queryLanguageParam = query.getParameters().find((m) => m.getParam() === `language=${language}`);

    it(`language should be '${language}'`, () => {
        expect(queryLanguageParam).toBeDefined();
    });
});
