import { BaseResponses, PublishOrScheduleLanguageVariantQuery } from '../../lib';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Publish or schedule language variant', () => {
    let response: BaseResponses.EmptyContentManagementResponse;
    let query: PublishOrScheduleLanguageVariantQuery;

    beforeAll((done) => {
     query = getTestClientWithJson(undefined).publishOrScheduleLanguageVariant()
            .byItemCodename('x')
            .byLanguageCodename('y')
            .withData({
                scheduled_to: '2019-01-31T11:00:00+01:00'
            });

            query.toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`query data should be set`, () => {
        expect(query.data.scheduled_to).toEqual(`2019-01-31T11:00:00+01:00`);
    });

    it(`url should be correct`, () => {
        const w1Url = cmTestClient.publishOrScheduleLanguageVariant().byItemCodename('x').byLanguageCodename('y').withData({}).getUrl();
        expect(w1Url).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/items/codename/x/variants/codename/y/publish`);
    });

    it(`response should be instance of EmptyContentManagementResponse class`, () => {
        expect(response).toEqual(jasmine.any(BaseResponses.EmptyContentManagementResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should NOT contain data`, () => {
        expect(response.data).toBeUndefined();
    });

});

