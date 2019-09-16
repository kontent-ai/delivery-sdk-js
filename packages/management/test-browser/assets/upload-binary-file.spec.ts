import { AssetResponses } from '../../lib';
import * as uploadBinaryResponseJson from '../fake-responses/assets/fake-upload-binary-file.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Upload binary file', () => {
    let response: AssetResponses.UploadBinaryFileResponse;

    beforeAll((done) => {

        getTestClientWithJson(uploadBinaryResponseJson).uploadBinaryFile().withData({
            binaryData: '',
            contentLength: 1212,
            contentType: 'image/jpeg',
            filename: 'xxx.png'
        })
            .toObservable()
            .subscribe(result => {
                response = result;
                done();
            });
    });

    it(`url should be correct`, () => {
        const url = cmTestClient.uploadBinaryFile().withData({
            binaryData: 'c',
            contentLength: 9,
            contentType: 'x',
            filename: 'y'
        }).getUrl();

        expect(url).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/files/y`);
    });

    it(`response should be instance of UploadBinaryFileResponse class`, () => {
        expect(response).toEqual(jasmine.any(AssetResponses.UploadBinaryFileResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`asset properties should be mapped`, () => {
        expect(response.data.id).toEqual(uploadBinaryResponseJson.id);
        expect(response.data.type).toEqual(uploadBinaryResponseJson.type);

    });

});

