import { ElementContracts } from '../data-contracts';
import { IGenericElement } from '../models';

export class GenericElementMapper {
    mapElement(response: ElementContracts.IViewContentTypeElementContract): IGenericElement {
        if (!response) {
            throw Error(`Invalid response for mapping element`);
        }

        return {
            codename: response.codename,
            name: response.name,
            type: response.type,
            options: response.options ? response.options : [],
            taxonomyGroup: response.taxonomy_group
        };
    }
}
