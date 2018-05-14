import { Parameters } from '../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Language #1', () => {

    const language = 'en';
    const context = new Context();
    context.defaultLanguage = language;
    setup(context);

    const movieCodename: string = 'warrior';

    const query = context.deliveryClient.item<Movie>(movieCodename).languageParameter(language);

    const languageParam = new Parameters.LanguageParameter('a');

    const queryLanguageParam = query.getParameters().find(m => m.getParam() === languageParam.getParam());

    it(`language should be '${language}'`, () => {
        expect(queryLanguageParam.getParamValue()).toEqual(language);
    });

});

describe('Language #2', () => {

    const language = 'cz';
    const context = new Context();
    context.defaultLanguage = language;
    setup(context);

    const newMovieCodename: string = 'warrior';

    const query = context.deliveryClient.item<Movie>(newMovieCodename).languageParameter(language);

    const languageParam = new Parameters.LanguageParameter('a');

    const queryLanguageParam = query.getParameters().find(m => m.getParam() === languageParam.getParam());

    it(`language should be '${language}'`, () => {
        expect(queryLanguageParam.getParamValue()).toEqual(language);
    });
});





