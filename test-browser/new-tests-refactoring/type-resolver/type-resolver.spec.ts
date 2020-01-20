import { ContentItem, ITypeResolverData, TypeResolver } from '../../../lib';
import { getDeliveryClientWithJson } from '../setup';
import * as responseJson from './type-resolver.spec.json';

class Article extends ContentItem {

    public articleId: string;
    public typeResolverData?: ITypeResolverData;

    constructor(data?: ITypeResolverData) {
        super();

        this.typeResolverData = data;
        this.articleId = data?.item.system.id ?? '0';
    }
}

describe('Type resolver', () => {
    const articles: Article[] = [];

    beforeAll((done) => {
        getDeliveryClientWithJson(responseJson, {
            projectId: '',
            typeResolvers: [
                new TypeResolver('article', (data) => new Article(data))
            ],
        })
            .items<Article>()
            .toObservable()
            .subscribe(result => {
                articles.push(...result.items);
                done();
            });
    });

    it(`Items should have 'typeResolverData' set`, () => {
        expect(articles.length).toEqual(responseJson.items.length);

        for (let i = 0; i < articles.length; i++) {
            const mappedArticle = articles[i];
            const rawArticle = responseJson.items[i];

            expect(mappedArticle).toBeDefined();
            expect(rawArticle).toBeDefined();

            expect(mappedArticle).toEqual(jasmine.any(Article));

            expect(mappedArticle.typeResolverData?.item).toEqual(rawArticle);

        }
    });
});

