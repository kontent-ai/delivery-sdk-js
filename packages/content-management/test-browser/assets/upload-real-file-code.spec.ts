/*
import { flatMap } from 'rxjs/operators';

import { AssetModels, AssetResponses } from '../../lib';
import { cmTestClient } from '../setup';


describe('Upload real binary file', () => {
    let response: AssetResponses.AddAssetResponse;

    beforeAll((done) => {

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

            cmTestClient.uploadBinaryFile(data).toObservable().pipe(
                flatMap(r => {
                    return cmTestClient.addAsset().withData({
                        title: 'my new file',
                        descriptions: [],
                        file_reference: {
                            id: r.data.id,
                            type: r.data.type
                        }
                    }).toObservable();
                })
            ).subscribe(r => {
                response = r;
                console.warn('Upload response: ', r);
                done();
            });
        };
        xhr.send();
    });


    it(`response should be instance of AddAssetResponse class`, () => {
        expect(response).toEqual(jasmine.any(AssetResponses.AddAssetResponse));
    });

});
*/

