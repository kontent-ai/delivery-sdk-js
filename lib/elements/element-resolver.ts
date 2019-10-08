import { ElementModels } from './element-models';

export type ElementResolver = (element: ElementModels.IElementWrapper) => ElementModels.IElement<any> | undefined;
