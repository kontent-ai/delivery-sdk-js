import { Contracts } from '../contracts';
import { IGenericElement } from '../models';

export class GenericElementMapper {
    mapElement(response: Contracts.IViewContentTypeElementContract): IGenericElement {
        if (!response) {
            throw Error(`Invalid response for mapping element`);
        }

        const element = response.element;

        return {
            codename: element.codename,
            name: element.name,
            type: element.type,
            options: element.options ? element.options : [],
            taxonomyGroup: element.taxonomy_group
        };
    }
}
