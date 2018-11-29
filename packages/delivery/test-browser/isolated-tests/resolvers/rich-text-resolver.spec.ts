import { ContentItem, Fields, ItemResponses, sdkInfo, TypeResolver, Link, ILinkResolverContext } from '../../../lib';
import { Context, MockQueryService, setup, warriorMovieJson } from '../../setup';
import { HttpService } from 'kentico-cloud-core';

describe('Rich text resolver', () => {

    const localLinkContexts: { [s: string]: ILinkResolverContext } = {};
    const globalLinkContexts: { [s: string]: ILinkResolverContext } = {};

    class MockMovie extends ContentItem {
        public plot!: Fields.RichTextField;
    }

    class MockActor extends ContentItem {
        public first_name!: Fields.TextField;

        constructor() {
            super({
                richTextResolver: (item, richTextContext) => {
                    return `<h1>${(<MockActor>item).first_name.text}</h1>`;
                },
                linkResolver: (link, linkContext) => {
                    globalLinkContexts[link.codename] = linkContext;
                    return `/global-actor/${link.urlSlug}/global-link`;
                }
            });
        }
    }

    const context = new Context();
    const typeResolvers: TypeResolver[] = [];
    typeResolvers.push(new TypeResolver('movie', () => new MockMovie()));
    typeResolvers.push(new TypeResolver('actor', () => new MockActor()));

    context.typeResolvers = typeResolvers;
    setup(context);

    const mockQueryService = new MockQueryService(context.getConfig(), new HttpService(), {
        host: sdkInfo.host,
        name: sdkInfo.name,
        version: sdkInfo.version
    });

    let response: ItemResponses.DeliveryItemResponse<MockMovie>;
    let responseWithQueryConfig: ItemResponses.DeliveryItemResponse<MockMovie>;

    let globalPlot: string = '';
    let localPlot: string = '';

    beforeAll((done) => {
        response = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {});

        responseWithQueryConfig = mockQueryService.mockGetSingleItem<MockMovie>(warriorMovieJson, {
            richTextResolver: (item, richTextContext) => {
                return `<h2>${(<MockActor>item).first_name.text}</h2>`;
            },
            linkResolver: (link, linkContext) => {
                localLinkContexts[link.codename] = linkContext;
                return `/local-actor/${link.urlSlug}/local-link`;
            }
        });

        globalPlot = response.item.plot.getHtml();
        localPlot = responseWithQueryConfig.item.plot.getHtml();
        done();
    });

    it(`verifies globally defined rich text contains correct html of linked item`, () => {
        const containsHtml = '<h1>Tom</h1>';
        expect(globalPlot).toContain(containsHtml);
    });

    it(`verifies locally defined rich text resolver override global resolvers and contains correct html`, () => {
        const containsHtml = '<h2>Tom</h2>';
        expect(localPlot).toContain(containsHtml);
    });

    it(`verifies globally defined rich text contains correct link`, () => {
        const containsHtml1 = '/global-actor/tom-hardy/global-link';
        expect(globalPlot).toContain(containsHtml1);

        const containsHtml2 = '/global-actor/joel-edgerton/global-link';
        expect(globalPlot).toContain(containsHtml2);
    });

    it(`verifies locally defined rich text contains correct link`, () => {
        const containsHtml1 = '/local-actor/tom-hardy/local-link';
        expect(localPlot).toContain(containsHtml1);

        const containsHtml2 = '/local-actor/joel-edgerton/local-link';
        expect(localPlot).toContain(containsHtml2);
    });

    it(`verifies that global links contains original texts of links`, () => {
        const joelLink = globalLinkContexts['joel_edgerton'];
        const tomLink = globalLinkContexts['tom_hardy'];

        expect(joelLink).toBeDefined();
        if (joelLink) {
            expect(joelLink.linkText).toEqual('Joel Edgerton');
        }

        expect(tomLink).toBeDefined();
        if (tomLink) {
            expect(tomLink.linkText).toEqual('Tom Hardy');
        }

    });

    it(`verifies that local links contains original texts of links`, () => {
        const joelLink = localLinkContexts['joel_edgerton'];
        const tomLink = localLinkContexts['tom_hardy'];

        expect(joelLink).toBeDefined();
        if (joelLink) {
            expect(joelLink.linkText).toEqual('Joel Edgerton');
        }

        expect(tomLink).toBeDefined();
        if (tomLink) {
            expect(tomLink.linkText).toEqual('Tom Hardy');
        }

    });
});

