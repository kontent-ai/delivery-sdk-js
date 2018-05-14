import { ElementContracts } from '../data-contracts';
import { Element } from '../models';

export class ElementMapper {

    mapElement(response: ElementContracts.IElementResponseContract): Element {
        if (!response) {
            throw Error(`Invalid response for mapping element`);
        }

        return new Element({
            codename: response.codename,
            name: response.name,
            type: response.type,
            options: response.options,
            taxonomyGroup: response.taxonomy_group
        });
    }
}
