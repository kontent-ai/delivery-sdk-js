import type { z } from "zod";
import type { DeliveryClientSchema } from "../../models/core.models.js";
import type { listTaxonomiesSchema, taxonomySchema, taxonomyTermSchema } from "./taxonomy.schemas.js";

export type TaxonomyTermPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof taxonomyTermSchema<TSchema>>>;

export type TaxonomyPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof taxonomySchema<TSchema>>>;

export type ListTaxonomiesPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listTaxonomiesSchema<TSchema>>>;
