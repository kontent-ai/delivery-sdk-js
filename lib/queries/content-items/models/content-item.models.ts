import type * as z from "zod/mini";
import type { DeliveryClientSchema } from "../../../models/core.models.js";
import type { ContentTypeCodenameOf, ElementCodenamesOf } from "../../content-types/models/content-type.models.js";
import type {
	contentItemSchema,
	contentItemSchemaExtended,
	contentItemSystemSchema,
	contentItemSystemWithCodename,
	fetchContentItemSchema,
	fetchContentItemSchemaExtended,
	itemsFeedSchema,
	itemsFeedSchemaExtended,
	itemsReferencingAssetSchema,
	itemsReferencingItemSchema,
	listContentItemsSchema,
	listContentItemsSchemaExtended,
} from "../schemas/content-item.schemas.js";
import type { ContentItemElementPayload } from "./element.models.js";

export type ContentItemSystem<TSchema extends DeliveryClientSchema, TTypeCodename extends ContentTypeCodenameOf<TSchema>> = z.infer<
	ReturnType<typeof contentItemSystemWithCodename<TSchema, TTypeCodename>>
>;

export type SnippetOf<
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends ContentTypeCodenameOf<TSchema>,
	TElements extends {
		readonly [Codename in keyof TElements]: Codename extends ElementCodenamesOf<TSchema, TTypeCodename>
			? ContentItemElementPayload
			: never;
	},
> = ContentItemOf<TSchema, TTypeCodename, TElements>;

export type ContentItemOf<
	TSchema extends DeliveryClientSchema,
	TTypeCodename extends ContentTypeCodenameOf<TSchema>,
	TElements extends {
		readonly [Codename in keyof TElements]: Codename extends ElementCodenamesOf<TSchema, TTypeCodename>
			? ContentItemElementPayload
			: never;
	},
> = {
	readonly system: ContentItemSystem<TSchema, TTypeCodename>;
	readonly elements: TElements;
};

export type ContentItemSystemPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof contentItemSystemSchema<TSchema>>>;
export type ContentItemPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof contentItemSchema<TSchema>>>;
export type ListContentItemsPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof listContentItemsSchema<TSchema>>>;
export type FetchContentItemPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof fetchContentItemSchema<TSchema>>>;
export type ItemsFeedPayload<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof itemsFeedSchema<TSchema>>>;
export type ItemsReferencingAssetPayload<TSchema extends DeliveryClientSchema> = z.infer<
	ReturnType<typeof itemsReferencingAssetSchema<TSchema>>
>;
export type ItemsReferencingItemPayload<TSchema extends DeliveryClientSchema> = z.infer<
	ReturnType<typeof itemsReferencingItemSchema<TSchema>>
>;

export type ContentItemPayloadExtended<TSchema extends DeliveryClientSchema> = z.infer<
	ReturnType<typeof contentItemSchemaExtended<TSchema>>
>;
export type FetchContentItemPayloadExtended<TSchema extends DeliveryClientSchema> = z.infer<
	ReturnType<typeof fetchContentItemSchemaExtended<TSchema>>
>;
export type ListContentItemsPayloadExtended<TSchema extends DeliveryClientSchema> = z.infer<
	ReturnType<typeof listContentItemsSchemaExtended<TSchema>>
>;
export type ItemsFeedPayloadExtended<TSchema extends DeliveryClientSchema> = z.infer<ReturnType<typeof itemsFeedSchemaExtended<TSchema>>>;
