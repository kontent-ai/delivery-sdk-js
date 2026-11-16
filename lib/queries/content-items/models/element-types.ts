import type * as z from "@zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import type { elementDef } from "../schemas/element.schemas.js";
import type { ContentItemPayload } from "./content-item.models.js";

export type Text = z.infer<typeof elementDef.text>;
export type Number = z.infer<typeof elementDef.number>;
/**
 * Rich text element. `TItem` types the resolved linked items and components in `items`,
 * `TLinkType` types the content type codenames of items referenced by links (`links[].type`).
 */
export type RichText<
	TItem extends ContentItemPayload<DeliveryClientSchema> = ContentItemPayload<DeliveryClientSchema>,
	TLinkType extends string = string,
> = z.infer<ReturnType<typeof elementDef.richText<TItem, TLinkType>>>;
export type MultipleChoice<TCodename extends string = string> = z.infer<ReturnType<typeof elementDef.multipleChoice<TCodename>>>;
export type DateTime = z.infer<typeof elementDef.dateTime>;
export type Asset = z.infer<typeof elementDef.asset>;
/**
 * Taxonomy element. `TCodename` types the term codenames, `TTaxonomyGroup` the codename of the taxonomy group.
 */
export type Taxonomy<TCodename extends string = string, TTaxonomyGroup extends string = string> = z.infer<
	ReturnType<typeof elementDef.taxonomy<TCodename, TTaxonomyGroup>>
>;
export type UrlSlug = z.infer<typeof elementDef.urlSlug>;
export type Custom = z.infer<typeof elementDef.custom>;
export type LinkedItems<TItem extends ContentItemPayload<DeliveryClientSchema> = ContentItemPayload<DeliveryClientSchema>> = z.infer<
	ReturnType<typeof elementDef.linkedItems<TItem>>
>;
