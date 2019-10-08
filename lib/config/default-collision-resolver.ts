import { ElementCollisionResolver } from '../models/item/item-resolvers';

export const defaultCollissionResolver: ElementCollisionResolver = (elementName) => `_${elementName}`;
