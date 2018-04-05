import { Element } from '../models/element/element.class';
import { CloudElementResponseInterfaces } from '../interfaces/element/cloud-responses';

export class ElementMapper {

    constructor(
    ) {
    }

    mapElement(response: CloudElementResponseInterfaces.ICloudElementResponse): Element {
        if (!response) {
            throw Error(`Invalid response for mapping element`);
        }

        return new Element(
            response.codename,
            response.type,
            response.name,
            response.taxonomy_group,
            response.options
        );
    }
}
