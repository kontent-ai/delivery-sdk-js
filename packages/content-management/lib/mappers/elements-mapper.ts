import { ElementContracts } from '../contracts';
import { ElementModels } from '../models';
import { BaseMapper } from './base-mapper';

export class ElementsMapper extends BaseMapper {

    mapTypeElements(elementsRaw: ElementContracts.IContentTypeElementContract[]): ElementModels.ContentTypeElementModel[] {
        return elementsRaw.map(m => this.mapTypeElement(m));
    }

    mapTypeElement(rawElement: ElementContracts.IContentTypeElementContract): ElementModels.ContentTypeElementModel {
        return new ElementModels.ContentTypeElementModel({
            codename: rawElement.codename,
            guidelines: rawElement.guidelines,
            id: rawElement.id,
            name: rawElement.name,
            type: rawElement.type
        });
    }

    mapElements(elementsRaw: ElementContracts.IContentItemElementContract[]): ElementModels.ContentItemElement[] {
        return elementsRaw.map(m => this.mapElement(m));
    }

    mapElement(rawElement: ElementContracts.IContentItemElementContract): ElementModels.ContentItemElement {
        return new ElementModels.ContentItemElement({
            element: super.mapReference(rawElement.element),
            value: rawElement.value
        });
    }
}

export const elementsMapper = new ElementsMapper();
