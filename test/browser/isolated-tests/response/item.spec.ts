import { Responses } from '../../../../lib';
import { getDeliveryClientWithJson, Movie } from '../../setup';
import * as warriorJson from '../fake-data/fake-warrior-response.json';

describe('Verifies mapping of delivery content item', () => {
    let responseWithLinkedItems: Responses.IViewContentItemResponse<Movie>;
    let responseWithoutLinkedItems: Responses.IViewContentItemResponse<Movie>;

    beforeAll(async () => {
        responseWithLinkedItems = (await getDeliveryClientWithJson(warriorJson).item<Movie>('x').toPromise()).data;
        responseWithoutLinkedItems = (
            await getDeliveryClientWithJson(warriorJson, {
                linkedItemsReferenceHandler: 'ignore',
                projectId: 'x'
            })
                .item<Movie>('x')
                .toPromise()
        ).data;
    });

    it(`checks system codename`, () => {
        expect(responseWithLinkedItems.item.system.codename).toEqual(warriorJson.item.system.codename);
    });

    it(`checks system id`, () => {
        expect(responseWithLinkedItems.item.system.id).toEqual(warriorJson.item.system.id);
    });

    it(`checks system type`, () => {
        expect(responseWithLinkedItems.item.system.type).toEqual(warriorJson.item.system.type);
    });

    it(`checks system collection`, () => {
        expect(responseWithLinkedItems.item.system.collection).toEqual(warriorJson.item.system.collection);
    });

    it(`checks last modified`, () => {
        expect(responseWithLinkedItems.item.system.lastModified).toEqual(warriorJson.item.system.last_modified);
    });

    it(`checks workflow step`, () => {
        expect(responseWithLinkedItems.item.system.workflowStep).toEqual(warriorJson.item.system.workflow_step);
    });

    it(`checks language`, () => {
        expect(responseWithLinkedItems.item.system.language).toEqual(warriorJson.item.system.language);
    });

    it(`checks site map locations`, () => {
        const locations: string[] = ['main_sitemap'];
        expect(responseWithLinkedItems.item.system.sitemapLocations).toEqual(locations);
    });

    it(`checks taxonomy element value`, () => {
        expect(responseWithLinkedItems.item.elements.releaseCategory.value[0].codename).toEqual(
            warriorJson.item.elements.releasecategory.value[0].codename
        );
    });


    it(`checks strongly typed taxonomy`, () => {
        const globalReleaseTaxonomy = responseWithLinkedItems.item.elements.releaseCategory.value.find(m => m.codename === 'global_release');
        const usReleaseTaxonomy = responseWithLinkedItems.item.elements.releaseCategory.value.find(m => m.codename === 'us_only');

        expect(globalReleaseTaxonomy).toBeDefined();
        expect(usReleaseTaxonomy).toBeDefined();
    });

    it(`checks text element`, () => {
        expect(responseWithLinkedItems.item.elements.title.value).toEqual(warriorJson.item.elements.title.value);
    });

    it(`checks rich text element`, () => {
        for (const linkedItemCodename of responseWithLinkedItems.item.elements.plot.linkedItemCodenames) {
            const linkedItem = responseWithLinkedItems.item.elements.plot.linkedItems.find(
                (m) => m.system.codename === linkedItemCodename
            );

            expect(linkedItem).toBeDefined();
            expect(linkedItem?.system.codename).toEqual(linkedItemCodename);
            expect(linkedItem?.elements).toBeDefined();
        }
    });

    it(`checks datetime element`, () => {
        expect(responseWithLinkedItems.item.elements.released.value).toEqual(warriorJson.item.elements.released.value);
    });

    it(`checks number element`, () => {
        expect(responseWithLinkedItems.item.elements.length.value).toEqual(warriorJson.item.elements.length.value);
    });

    it(`checks assets element`, () => {
        expect(responseWithLinkedItems.item.elements.poster.value.length).toEqual(
            warriorJson.item.elements.poster.value.length
        );
        expect(responseWithLinkedItems.item.elements.poster.value[0].url).toEqual(
            warriorJson.item.elements.poster.value[0].url
        );
    });

    it(`checks that correct number of linked items are created`, () => {
        expect(responseWithLinkedItems.item.elements.stars.linkedItems.length).toEqual(
            warriorJson.item.elements.stars.value.length
        );
    });

    it(`checks that text element in first linked item is set`, () => {
        expect(
            responseWithLinkedItems.item.elements.stars.linkedItems.find(
                (m) =>
                    m.elements.firstName.value === warriorJson.modular_content.joel_edgerton.elements.first_name.value
            )
        ).toBeDefined();
    });

    it(`checks that text element in second linked item is set`, () => {
        expect(
            responseWithLinkedItems.item.elements.stars.linkedItems.find(
                (m) => m.elements.firstName.value === warriorJson.modular_content.tom_hardy.elements.first_name.value
            )
        ).toBeDefined();
    });

    describe('Checks disabled linked items mapping', () => {
        it(`linked items should not be mapped`, () => {
            expect(responseWithoutLinkedItems.item.elements.stars.linkedItems.length).toEqual(0);
        });

        it(`linked items should have empty array`, () => {
            expect(responseWithoutLinkedItems.item.elements.plot.linkedItemCodenames.length).toEqual(
                warriorJson.item.elements.plot.modular_content.length
            );
            expect(responseWithoutLinkedItems.item.elements.plot.linkedItems.length).toEqual(0);
        });
    });
});
