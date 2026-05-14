import type * as z from "zod/mini";
import type { assetValueSchema, contentItemElementSchema, contentItemElementSchemaExtended } from "../schemas/element.schemas.js";

export type Asset = z.infer<typeof assetValueSchema>;

export type ContentItemElementPayload = z.infer<typeof contentItemElementSchema>;

export type ContentItemElementPayloadExtended = z.infer<typeof contentItemElementSchemaExtended>;
