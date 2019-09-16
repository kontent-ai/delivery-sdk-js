import { enumHelper } from '@kentico/kontent-core';

import { ElementContracts, SharedContracts } from '../contracts';
import { ElementModels, SharedModels } from '../models';
import { BaseMapper } from './base-mapper';

export class ElementsMapper extends BaseMapper {

    mapTypeElements(elementsRaw: ElementContracts.IContentTypeElementContract[]): ElementModels.ElementModel[] | ElementModels.MultipleChoiceElementModel[] {
        return elementsRaw.map(m => this.mapTypeElement(m));
    }

    mapTypeElement(rawElement: ElementContracts.IContentTypeElementContract): ElementModels.ElementModel | ElementModels.MultipleChoiceElementModel {
        const defaultElementModel =  new ElementModels.ElementModel({
            codename: rawElement.codename,
            guidelines: rawElement.guidelines,
            id: rawElement.id,
            name: rawElement.name,
            type: this.mapElementType(rawElement.type)
        });

        if (rawElement.type.toLowerCase() === ElementModels.ElementType.multipleChoice.toLowerCase()) {
            return new ElementModels.MultipleChoiceElementModel(defaultElementModel, {
                mode: this.mapMultipleChoiceMode(rawElement.mode),
                options: this.mapMultipleChoiceOptions(rawElement.options)
            });
        }

        return defaultElementModel;
    }

    mapElements(elementsRaw: ElementContracts.IContentItemElementContract[]): ElementModels.ContentItemElement[] {
        return elementsRaw.map(m => this.mapElement(m));
    }

    mapElement(rawElement: ElementContracts.IContentItemElementContract): ElementModels.ContentItemElement {
        return new ElementModels.ContentItemElement({
            element: super.mapReference(rawElement.element),
            value: this.mapElementValue(rawElement.value)
        });
    }

    private mapMultipleChoiceOptions(options?: ElementContracts.IContentTypeElementMultipleChoiceElementOptionsContract[]): ElementModels.MultipleChoiceElementOption[] {
        if (!options) {
            throw Error(`No value provided for mapping multiple choice options`);
        }

        return options.map(m => new ElementModels.MultipleChoiceElementOption({
            codename: m.codename,
            id: m.id,
            name: m.name
        }));
    }

    private mapMultipleChoiceMode(mode: string | undefined): ElementModels.ElementMode {
        if (!mode) {
            throw Error(`No value provided for multiple choice mode`);
        }

        const mappedMode = enumHelper.getEnumFromValue<ElementModels.ElementMode>(ElementModels.ElementMode, mode);

        if (!mappedMode) {
            throw Error(`Could not map multiple choice element option '${mode}'`);
        }

        return mappedMode;
    }

    private mapElementValue(rawValue: string | number | SharedContracts.IReferenceObjectContract[]): string | number | SharedModels.ReferenceObject[] {
        if (Array.isArray(rawValue)) {
            return rawValue.map(m => super.mapReference(m));
        }

        return rawValue;
    }

    private mapElementType(type: string): ElementModels.ElementType {
        const mappedType = enumHelper.getEnumFromValue<ElementModels.ElementType>(ElementModels.ElementType, type);

        if (!mappedType) {
            throw Error(`Invalid element type '${type}'`);
        }

        return mappedType;
    }
}

export const elementsMapper = new ElementsMapper();
