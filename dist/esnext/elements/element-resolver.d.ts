import { ElementModels } from './element-models';
export declare type ElementResolver = (element: ElementModels.IElementWrapper) => ElementModels.IElement<any> | undefined;
