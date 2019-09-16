import { ContentTypeResponses, ElementModels } from '../../lib';
import * as viewContentTypeJson from '../fake-responses/content-types/fake-view-content-type.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';


describe('View content type', () => {
    let response: ContentTypeResponses.ViewContentTypeResponse;

    beforeAll((done) => {
        getTestClientWithJson(viewContentTypeJson).viewContentType()
            .byTypeCodename('x')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const urlByCodename = cmTestClient.viewContentType().byTypeCodename('x').getUrl();
        const urlByInternalId = cmTestClient.viewContentType().byTypeId('y').getUrl();
        const urlByExternalId = cmTestClient.viewContentType().byTypeExternalId('c').getUrl();

        expect(urlByCodename).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/types/codename/x`);
        expect(urlByInternalId).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/types/y`);
        expect(urlByExternalId).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/types/external-id/c`);
    });

    it(`response should be instance of ViewContentTypeResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentTypeResponses.ViewContentTypeResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`response should contain mapped multiple choice element model`, () => {
        const multipleChoiceField = response.data.elements.find(m => m.codename === 'video_host');

        if (!multipleChoiceField) {
            throw Error(`Missing multiple choice field`);
        }

        expect(multipleChoiceField).toEqual(jasmine.any(ElementModels.MultipleChoiceElementModel));
    });

    it(`content type properties should be mapped`, () => {
        const originalItem = viewContentTypeJson;
        const contentType = response.data;

        expect(contentType.codename).toEqual(originalItem.codename);
        expect(contentType.name).toEqual(originalItem.name);
        expect(contentType.lastModified).toEqual(new Date(originalItem.last_modified));
        expect(contentType.elements.length).toEqual(originalItem.elements.length);
        expect(Array.isArray(contentType.elements)).toBeTruthy();

        contentType.elements.forEach(element => {

            const originalElement = originalItem.elements.find(m => m.id === element.id);
            if (!originalElement) {
                throw Error(`Invalid element with id '${element.id}'`);
            }

            if (element.type === ElementModels.ElementType.multipleChoice) {
                expect(element).toEqual(jasmine.any(ElementModels.MultipleChoiceElementModel));
            } else {
                expect(element).toEqual(jasmine.any(ElementModels.ElementModel));
            }

            expect(element.codename).toEqual(originalElement.codename);
            expect(element.name).toEqual(originalElement.name);
            expect(element.type.toString().toLowerCase()).toEqual(originalElement.type.toLowerCase());
        });
    });


});


