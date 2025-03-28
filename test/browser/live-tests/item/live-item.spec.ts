import { Responses } from '../../../../lib';
import { Context, Movie, setup } from '../../setup';

describe('Live item', () => {
    const context = new Context();
    setup(context);

    const movieCodename: string = 'warrior';
    let response: Responses.IViewContentItemResponse<Movie>;

    beforeAll(async () => {
        response = (await context.deliveryClient.item<Movie>(movieCodename).queryConfig({}).toPromise()).data;
    });

    it(`item response should be defined`, () => {
        expect(response).toBeDefined();
    });

    it(`item should be defined`, () => {
        expect(response.item).toBeDefined();
    });

    it(`title should be 'Warrior'`, () => {
        expect(response.item.elements.title.value).toEqual('Warrior');
    });

    it(`released date should be '2011-09-09T00:00:00Z'`, () => {
        expect(response.item.elements.released.value).toEqual('2011-09-09T00:00:00Z');
    });

    it(`poster asset should be defined`, () => {
        expect(response.item.elements.poster).toBeDefined();
    });

    it(`poster asset' url should be set`, () => {
        const assetUrl = response.item.elements.poster.value[0].url;
        expect(assetUrl).toBeDefined();
        expect(assetUrl).toContain('https://');
    });

    it(`category options should be defined`, () => {
        expect(response.item.elements.category.value).toBeDefined();
    });

    it(`there should be 2 category options defined`, () => {
        expect(response.item.elements.category.value.length).toEqual(2);
    });

    it(`checks codename of first category option`, () => {
        expect(response.item.elements.category.value[0].codename).toEqual('action');
    });

    it(`checks codename of second category option`, () => {
        expect(response.item.elements.category.value[1].codename).toEqual('drama');
    });

    it(`checks that category options are of proper type`, () => {
        expect(response.item.elements.category.value[1]).toBeDefined();
    });

    it(`stars linked items should be defined`, () => {
        expect(response.item.elements.stars).toBeDefined();
    });

    it(`check number of stars items`, () => {
        expect(response.item.elements.stars.value.length).toEqual(2);
    });

    it(`checks that linkedItemCodenames element is mapped and container proper data`, () => {
        expect(response.item.elements.plot.linkedItemCodenames).toBeDefined();
        expect(response.item.elements.plot.linkedItemCodenames).toContain('tom_hardy');
        expect(response.item.elements.plot.linkedItemCodenames).toContain('joel_edgerton');
    });

    it(`check that linked item (Actor) has 'first_name' text properly assigned`, () => {
        expect(response.item.elements.stars.linkedItems[0].elements.first_name.value).toEqual('Tom');
    });

    it(`images should be mapped in plot rich text element`, () => {
        const images = response.item.elements.plot.images;

        expect(images).toBeDefined();
        expect(images.length).toEqual(2);
    });

    it(`verify linked items included in response`, () => {
        expect(Object.keys(response.linkedItems).length).toEqual(3);
        for (const key of Object.keys(response.linkedItems)) {
            const linkedItem = response.linkedItems[key];
            expect(linkedItem).toBeDefined();
        }
    });
});
