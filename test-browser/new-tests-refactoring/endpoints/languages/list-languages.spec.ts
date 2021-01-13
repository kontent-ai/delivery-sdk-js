import { Language, LanguageResponses } from '../../../../lib';
import { Context, setup } from '../../../setup';
import { getDeliveryClientWithJson } from '../../setup';
import * as responseJson from './list-languages.spec.json';

describe('List languages', () => {
    const context = new Context();
    setup(context);

    let response: LanguageResponses.ListLanguagesResponse;

    beforeAll((done) => {
        getDeliveryClientWithJson(responseJson)
            .languages()
            .toObservable()
            .subscribe((result) => {
                response = result;
                done();
            });
    });

    it(`Response should be of proper type`, () => {
        expect(response).toEqual(jasmine.any(LanguageResponses.ListLanguagesResponse));
    });

    it(`Response should have all properties assigned`, () => {
        expect(response.languages.length).toEqual(responseJson.languages.length);

        for (const item of response.languages) {
            const originalItem = responseJson.languages.find((m) => m.system.id === item.system.id);

            if (!originalItem) {
                throw Error(`Invalid language '${item.system.id}'`);
            }

            expect(item).toEqual(jasmine.any(Language));
            expect(item.system.id).toEqual(originalItem.system.id);
            expect(item.system.name).toEqual(originalItem.system.name);
            expect(item.system.codename).toEqual(originalItem.system.codename);
        }
    });
});
