import type * as z from "zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import type { elementDef } from "../schemas/element.schemas.js";
import type { ContentItemPayload } from "./content-item.models.js";

export type Text = z.infer<typeof elementDef.text>;
export type Number = z.infer<typeof elementDef.number>;
export type RichText<TItem extends ContentItemPayload<DeliveryClientSchema> = ContentItemPayload<DeliveryClientSchema>> = z.infer<
	ReturnType<typeof elementDef.richText<TItem>>
>;
export type MultipleChoice<TCodename extends string = string> = z.infer<ReturnType<typeof elementDef.multipleChoice<TCodename>>>;
export type DateTime = z.infer<typeof elementDef.dateTime>;
export type Asset = z.infer<typeof elementDef.asset>;
export type Taxonomy<TCodename extends string = string> = z.infer<ReturnType<typeof elementDef.taxonomy<TCodename>>>;
export type UrlSlug = z.infer<typeof elementDef.urlSlug>;
export type Custom = z.infer<typeof elementDef.custom>;
export type LinkedItems<TItem extends ContentItemPayload<DeliveryClientSchema> = ContentItemPayload<DeliveryClientSchema>> = z.infer<
	ReturnType<typeof elementDef.linkedItems<TItem>>
>;
