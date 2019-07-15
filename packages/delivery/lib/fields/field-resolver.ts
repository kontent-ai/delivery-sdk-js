import { FieldModels } from './field-models';

export type FieldResolver = (field: FieldModels.IFieldMapWrapper) => FieldModels.IField<any> | undefined;
