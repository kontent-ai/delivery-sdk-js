import { FieldModels } from './field-models';

export type FieldResolver = (type: string, element: string, data: string) => FieldModels.IField | undefined;
