import { ElementContracts } from '../data-contracts';
import { GenericElement } from '../models';

export class GenericElementMapper {

    mapElement(response: ElementContracts.IViewContentTypeElementContract): GenericElement {
        if (!response) {
            throw Error(`Invalid response for mapping element`);
        }

        return new GenericElement({
            codename: response.codename,
            name: response.name,
            type: response.type,
            options: response.options ? response.options : [],
            taxonomyGroup: response.taxonomy_group
        });
    }
}

