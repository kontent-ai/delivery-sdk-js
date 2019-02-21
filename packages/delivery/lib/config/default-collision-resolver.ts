import { ItemFieldCollisionResolver } from '../models/item/item-resolvers';

export const defaultCollissionResolver: ItemFieldCollisionResolver = (fieldName) => `_${fieldName}`;
