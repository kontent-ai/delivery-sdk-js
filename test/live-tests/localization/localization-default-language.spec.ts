// setup
import { setup, Context, Actor, Movie } from '../../setup';

// models
import { ItemResponses } from '../../../lib';

// tests
describe('Localization with globally defined language #1', () => {

    const language = 'en';
    const sharedContext = new Context();
    sharedContext.defaultLanguage = language;
    setup(sharedContext);

    const movieCodename: string = 'warrior';
    let response: ItemResponses.DeliveryItemResponse<Movie>;

    beforeAll((done) => {
        sharedContext.deliveryClient.item<Movie>(movieCodename)
            .get()
            .subscribe(r => {
                response = r as ItemResponses.DeliveryItemResponse<Movie>;
                done();
            });
    });

    it(`language should be '${language}'`, () => {
        expect(response.item.system.language).toEqual(language);
    });

    it(`title should be localized to ${language}`, () => {
        expect(response.item.title.text).toEqual('Warrior');
    });
});

// tests
describe('Localization with globally defined language #2', () => {

    const language = 'cz';
    const context = new Context();
    context.defaultLanguage = language;
    setup(context);

    const newMovieCodename: string = 'warrior';
    let response: ItemResponses.DeliveryItemResponse<Movie>;

    beforeAll((done) => {
        context.deliveryClient.item<Movie>(newMovieCodename)
            .get()
            .subscribe(r => {
                response = r as ItemResponses.DeliveryItemResponse<Movie>;
                done();
            });
    });

    it(`language should be '${language}'`, () => {
        expect(response.item.system.language).toEqual(language);
    });

    it(`title should be localized to ${language}`, () => {
        expect(response.item.title.text).toEqual('Warrior-cz');
    });
});

// tests
describe('Localization defined by query', () => {

    const defaultLanguage = 'cz';
    const queryLanguage = 'en';
    const context = new Context();
    context.defaultLanguage = defaultLanguage;
    setup(context);

    const newMovieCodename: string = 'warrior';
    let response: ItemResponses.DeliveryItemResponse<Movie>;

    beforeAll((done) => {
        context.deliveryClient.item<Movie>(newMovieCodename)
            .languageParameter(queryLanguage)
            .get()
            .subscribe(r => {
                response = r as ItemResponses.DeliveryItemResponse<Movie>;
                done();
            });
    });

    it(`should not use globally defined language'${queryLanguage}'`, () => {
        expect(response.item.system.language).toEqual(queryLanguage);
    });

    it(`should be localized to ${queryLanguage}`, () => {
        expect(response.item.title.text).toEqual('Warrior');
    });
});




