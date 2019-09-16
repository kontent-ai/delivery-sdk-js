import { ProjectModels, ProjectResponses } from '../../lib';
import * as validateProjectContentJson from '../fake-responses/projects/fake-validate-project-content.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';


describe('Validate project content', () => {
    let response: ProjectResponses.ValidateProjectContentResponse;

    beforeAll((done) => {
        getTestClientWithJson(validateProjectContentJson).validateProjectContent()
            .forProjectId('xxx')
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const url = cmTestClient.validateProjectContent().forProjectId('xxx').getUrl();

        expect(url).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/validate`);
    });

    it(`response should be instance of ValidateProjectContentResponse class`, () => {
        expect(response).toEqual(jasmine.any(ProjectResponses.ValidateProjectContentResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`project data should by mapped`, () => {
        expect(response.data.project).toEqual(jasmine.any(ProjectModels.ProjectReportModel));

        expect(response.data.project.id).toEqual(validateProjectContentJson.project.id);
        expect(response.data.project.name).toEqual(validateProjectContentJson.project.name);
    });

    it(`variant issue data should be mapped`, () => {
        response.data.variantIssues.forEach(variantIssue => {
            expect(variantIssue).toEqual(jasmine.any(ProjectModels.ProjectVariantIssueModel));

            variantIssue.issues.forEach(issue => {
                expect(issue).toEqual(jasmine.any(ProjectModels.ProjectIssueModel));
                expect(issue.element).toEqual(jasmine.any(ProjectModels.ProjectVariantElementModel));
                expect(issue.messages.length).toBeGreaterThan(0);

            });

            expect(variantIssue.item).toEqual(jasmine.any(ProjectModels.ProjectVariantContentItemModel));
            expect(variantIssue.language).toEqual(jasmine.any(ProjectModels.ProjectVariantLanguageModel));
        });

    });

    it(`type issue data should be mapped `, () => {
        response.data.typeIssues.forEach(typeIssue => {
            expect(typeIssue).toEqual(jasmine.any(ProjectModels.ProjectTypeIssueModel));

            typeIssue.issues.forEach(issue => {
                expect(issue).toEqual(jasmine.any(ProjectModels.ProjectIssueModel));
                expect(issue.element).toEqual(jasmine.any(ProjectModels.ProjectVariantElementModel));
                expect(issue.messages.length).toBeGreaterThan(0);

            });

            expect(typeIssue.type).toEqual(jasmine.any(ProjectModels.ProjectTypeModel));
        });
    });

});

