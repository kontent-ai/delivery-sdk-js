import { HttpService } from 'kentico-cloud-core';

describe('Developer testing', () => {

    const httpService = new HttpService();

    beforeAll((done) => {
        httpService.get({
            url: 'https://deliver.kenticocloud.com/da5abe9f-fdad-4168-97cd-b3464be2ccb9/items/warrior',
            mapError: (error) => error
        })
            .subscribe((response) => {
                console.log(response);
                done();
            });
    });

    it(`Test`, () => {
        expect(true).toBeDefined();
    });

});

