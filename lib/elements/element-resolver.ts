import { ElementModels } from './element-models';

export type ElementResolver = (element: ElementModels.IElementWrapper) => any | undefined;
