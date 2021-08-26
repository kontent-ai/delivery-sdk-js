import { ContentItem, ContentItemSystemAttributes, Elements } from '../../../../../lib';
import { getDeliveryClientWithJson } from '../../setup';
import * as responseJson from './collission-element-names.spec.json';

const debugPropName = 'debug';
const systemCollisionName = '_system';

describe(`Collision element names`, () => {
    let item: ContentItem;

    beforeAll((done) => {
        getDeliveryClientWithJson(responseJson).item('x')
            .toObservable()
            .subscribe(result => {
                item = result.item;
                done();
            });
    });

    it(`Element with codename '${debugPropName}' should not be remapped`, () => {
        const newElementsElement = item[debugPropName];

        expect(newElementsElement).toEqual(jasmine.any(Elements.TextElement));
        expect(newElementsElement.value).toEqual(responseJson.item.elements.debug.value);

        // original elements should still be mapped
        expect(responseJson.item.elements.title.value).toEqual(item.title.value);
    });

    it(`Element with codename '${systemCollisionName}' should be remapped`, () => {
        expect(responseJson.item.elements.system).toBeDefined();

        const systemElement = item[systemCollisionName] as Elements.TextElement;

        expect(systemElement).toEqual(jasmine.any(Elements.TextElement));
        expect(systemElement.value).toEqual(responseJson.item.elements.system.value);

        // original system attributes should still be mapped
        expect(item.system).toEqual(jasmine.any(ContentItemSystemAttributes));
    });

});

