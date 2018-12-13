import { AssetModels, AssetResponses } from '../../lib';
import * as uploadBinaryResponseJson from '../fake-responses/assets/fake-upload-binary-file.json';
import { cmTestClient, getTestClientWithJson, testProjectId } from '../setup';


describe('Upload binary file', () => {
    let response: AssetResponses.UploadBinaryFileResponse;

    beforeAll((done) => {

        getTestClientWithJson(uploadBinaryResponseJson).uploadBinaryFile({
            binaryData: '',
            contentLength: 1212,
            contentType: 'image/jpeg',
            filename: 'myfile.jpeg'
        })
            .toObservable()
            .subscribe(result => {
                response = result;
                //  done();
            });

        // this is testing upload and should be removed in future
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://assets-eu-01.kc-usercontent.com/63117da1-007f-01dd-86eb-23e8353ac375/b05bdc04-e24f-48c3-857c-bb7b926f5542/mvc-essentials-intro-intro.png');
        xhr.responseType = 'blob';
        xhr.onload = () => {
            console.warn('Request response:', xhr);

            const contentLength = xhr.response.size;
            const contentType = xhr.response.type;
            const fileBinary = xhr.response;

            const data: AssetModels.IUploadBinaryFileRequestData = {
                binaryData: fileBinary,
                contentLength: contentLength,
                contentType: contentType,
                filename: 'myfile.png'
            };

            cmTestClient.uploadBinaryFile(data).toObservable().subscribe(r => {
                console.warn('Upload response: ', r);
                done();
            });
        };
        xhr.send();
    });

    it(`url should be correct`, () => {
        const url = cmTestClient.uploadBinaryFile({
            binaryData: 'c',
            contentLength: 1,
            contentType: 'x',
            filename: 'y'
        }).getUrl();

        expect(url).toEqual(`https://manage.kenticocloud.com/v2/projects/${testProjectId}/files/y`);
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

