import type * as z from "zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import type { listTaxonomiesSchema, taxonomySchema, taxonomyTermSchema } from "../schemas/taxonomy.schemas.js";

export type TaxonomyTermPayload<TTermCodenames extends string> = z.infer<ReturnType<typeof taxonomyTermSchema<TTermCodenames>>>;

export type TaxonomyPayload<TSchema extends DeliveryClientSchema, TTermCodenames extends string> = z.infer<
	ReturnType<typeof taxonomySchema<TSchema, TTermCodenames>>
>;

export type ListTaxonomiesPayload<TSchema extends DeliveryClientSchema, TTermCodenames extends string> = z.infer<
	ReturnType<typeof listTaxonomiesSchema<TSchema, TTermCodenames>>
>;
