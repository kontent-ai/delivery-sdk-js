import type * as z from "zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import type { listTaxonomiesSchema, taxonomySchema, taxonomyTermSchema } from "../schemas/taxonomy.schemas.js";

export type TaxonomyTermPayload<TCodename extends string> = z.infer<ReturnType<typeof taxonomyTermSchema<TCodename>>>;

export type TaxonomyPayload<TSchema extends DeliveryClientSchema, TCodename extends string> = z.infer<
	ReturnType<typeof taxonomySchema<TSchema, TCodename>>
>;

export type ListTaxonomiesPayload<TSchema extends DeliveryClientSchema, TCodename extends string> = z.infer<
	ReturnType<typeof listTaxonomiesSchema<TSchema, TCodename>>
>;
