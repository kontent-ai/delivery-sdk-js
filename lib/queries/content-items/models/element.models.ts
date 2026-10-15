import type * as z from "@zod/mini";
import type { contentItemElementSchema, contentItemElementSchemaExtended } from "../schemas/element.schemas.js";

export type ContentItemElementPayload = z.infer<typeof contentItemElementSchema>;
export type ContentItemElementPayloadExtended = z.infer<typeof contentItemElementSchemaExtended>;
